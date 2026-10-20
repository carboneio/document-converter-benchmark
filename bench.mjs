#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { connect } from 'node:net';
import os from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { SERVICES, TESTS } from './benchmarks.config.mjs';
import { generateReport } from './report.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(ROOT, 'results');
const OUTPUT_DIR = join(ROOT, 'output');
const SUMMARY_FILE = join(RESULTS_DIR, 'summary.json');
const LABEL = 'bench=document-converter-benchmark';

const USAGE = `Usage: node bench.mjs <command> [options]

Commands:
  list                 List services and tests
  verify               Start each service, check that a real PDF conversion works, then stop it
  run                  verify + warmup + k6 load test for each test, then regenerate the docs
  report               Regenerate README.md, RESULT.md and result.svg from results/summary.json

Options:
  --only <a,b,...>     Filter by tool (carbone), service (carbone-4), test (carbone-4-html) or format (html, docx)
  --duration <d>       k6 test duration (default: 1m)
  --vus <n>            k6 virtual users (default: 5)
  --warmup <n>         Conversions sent before each k6 run (default: 10)
  --cooldown <s>       Pause between two k6 runs on the same container (default: 5)
  --ready-timeout <s>  Max wait for a service to convert its first document (default: 300)
  --pull               Always pull Docker images (default: only when missing)
  --no-report          Do not regenerate the docs at the end of "run"
  -h, --help           Show this help
`;

// --- Small helpers ---

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (msg = '') => console.log(msg);
const step = (msg) => console.log(`\n\x1b[1m▶ ${msg}\x1b[0m`);
const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const warn = (msg) => console.log(`  \x1b[33m!\x1b[0m ${msg}`);
const fail = (msg) => console.log(`  \x1b[31m✗\x1b[0m ${msg}`);

function sh(cmd, args, { inherit = false, allowFail = false } = {}) {
  const res = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.error) throw res.error;
  if (res.status !== 0 && !allowFail) {
    throw new Error(`${cmd} ${args.join(' ')} failed (exit ${res.status})\n${res.stderr ?? ''}`.trim());
  }
  return res;
}

const docker = (args, opts) => sh('docker', args, opts);
const containerName = (service) => `bench-${service.id}`;
const baseUrl = (service) => `http://localhost:${service.ports[0]}`;

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = connect({ host: '127.0.0.1', port });
    socket.setTimeout(1000);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => resolve(false));
  });
}

// --- Selection ---

function selectTests(only) {
  if (!only) return TESTS;
  const tokens = only.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  const selected = TESTS.filter((test) =>
    tokens.some((t) =>
      t === test.id ||
      t === test.service.id ||
      t === test.format ||
      test.service.tool.toLowerCase().startsWith(t),
    ),
  );
  if (selected.length === 0) throw new Error(`--only "${only}" does not match any test (see "node bench.mjs list")`);
  return selected;
}

function groupByService(tests) {
  return SERVICES
    .map((service) => ({ service, tests: tests.filter((t) => t.service === service) }))
    .filter((group) => group.tests.length > 0);
}

// --- Docker lifecycle ---

let currentContainer = null;
let currentK6 = null;

function cleanupStaleContainers() {
  const ids = docker(['ps', '-aq', '--filter', `label=${LABEL}`]).stdout.trim();
  if (ids) docker(['rm', '-f', ...ids.split('\n')]);
}

const platformArgs = (service) => (service.platform ? ['--platform', service.platform] : []);

function ensureImage(service, pull) {
  if (service.build) {
    log(`  building ${service.build.tag} from ${service.build.context}`);
    docker(['build', '-q', ...platformArgs(service), ...(pull ? ['--pull'] : []), '-t', service.build.tag, service.build.context]);
    return;
  }
  const exists = docker(['image', 'inspect', ...platformArgs(service), service.image], { allowFail: true }).status === 0;
  if (pull || !exists) {
    log(`  pulling ${service.image}${service.platform ? ` (${service.platform})` : ''}`);
    docker(['pull', ...platformArgs(service), service.image], { inherit: true });
  }
}

function imageInfo(image) {
  const res = docker(['image', 'inspect', image], { allowFail: true });
  if (res.status !== 0) return { tag: image };
  const [info] = JSON.parse(res.stdout);
  const digest = info.RepoDigests?.[0]?.split('@')[1];
  return {
    tag: image,
    id: info.Id?.replace('sha256:', '').slice(0, 12),
    digest: digest ? digest.slice(0, 19) : undefined,
    created: info.Created?.slice(0, 10),
    version: info.Config?.Labels?.['org.opencontainers.image.version'],
    architecture: info.Architecture,
  };
}

async function startContainer(service) {
  const name = containerName(service);
  docker(['rm', '-f', name], { allowFail: true });

  const [hostPort, containerPort] = service.ports;
  if (await isPortInUse(hostPort)) {
    throw new Error(`port ${hostPort} is already in use, stop the process or container using it`);
  }

  const publish = `${service.bind ? `${service.bind}:` : ''}${hostPort}:${containerPort}`;
  docker([
    'run', '-d', '--name', name, '--label', LABEL, '-p', publish,
    ...platformArgs(service),
    ...(service.dockerArgs ?? []),
    service.image,
    ...(service.cmd ?? []),
  ]);
  currentContainer = name;
  return name;
}

function stopContainer(name) {
  if (!name) return;
  docker(['rm', '-f', name], { allowFail: true });
  if (currentContainer === name) currentContainer = null;
}

function saveContainerLogs(name) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const res = docker(['logs', name], { allowFail: true });
  const file = join(OUTPUT_DIR, `${name}.log`);
  writeFileSync(file, `${res.stdout ?? ''}${res.stderr ?? ''}`);
  return file;
}

// --- Conversion checks ---

async function convertOnce(test, timeoutMs = 30000) {
  const { url, init } = test.verify(baseUrl(test.service));
  const started = performance.now();
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  const body = Buffer.from(await res.arrayBuffer());
  const ms = performance.now() - started;

  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status}: ${body.toString('utf8', 0, 200).trim()}`);
  }
  if (body.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new Error(`response is not a PDF (starts with ${JSON.stringify(body.toString('latin1', 0, 20))})`);
  }
  if (body.length < 1000) {
    throw new Error(`PDF is suspiciously small (${body.length} bytes)`);
  }
  return { status: res.status, bytes: body.length, ms: Math.round(ms), body };
}

async function waitUntilReady(test, timeoutSec) {
  const deadline = Date.now() + timeoutSec * 1000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      return await convertOnce(test);
    } catch (err) {
      lastError = err;
      await sleep(2000);
    }
  }
  throw new Error(`service not ready after ${timeoutSec}s: ${lastError?.cause?.code ?? lastError?.message}`);
}

async function verifyTest(test) {
  const result = await convertOnce(test);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const file = join(OUTPUT_DIR, `${test.id}.pdf`);
  writeFileSync(file, result.body);
  ok(`${test.id}: valid PDF (${(result.bytes / 1024).toFixed(1)} KB in ${result.ms}ms) -> output/${test.id}.pdf`);
  return { status: result.status, bytes: result.bytes, ms: result.ms };
}

async function warmup(test, count) {
  let failures = 0;
  for (let i = 0; i < count; i++) {
    try { await convertOnce(test); } catch { failures++; }
  }
  if (failures) warn(`warmup: ${failures}/${count} conversions failed`);
  else ok(`warmup: ${count} conversions`);
}

// --- k6 ---

function runK6(test, { vus, duration }) {
  mkdirSync(RESULTS_DIR, { recursive: true });
  const jsonFile = join(RESULTS_DIR, `${test.id}.json`);
  const args = [
    'run', '--no-color',
    '--summary-export', jsonFile,
    '-e', `BASE_URL=${baseUrl(test.service)}`,
    '-e', `VUS=${vus}`,
    '-e', `DURATION=${duration}`,
    test.script,
  ];
  log(`  k6 ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const child = spawn('k6', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    currentK6 = child;
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; process.stdout.write(chunk); });
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      currentK6 = null;
      if (code !== 0 && code !== 99) return reject(new Error(`k6 exited with code ${code}`));
      if (!existsSync(jsonFile)) return reject(new Error('k6 did not write its summary export'));
      const textFile = join(RESULTS_DIR, `${test.id}.txt`);
      writeFileSync(textFile, extractSummaryText(stdout));
      resolve({ thresholdsPassed: code === 0, export: JSON.parse(readFileSync(jsonFile, 'utf8')) });
    });
  });
}

/** Keep only the end-of-test summary (drop the banner and the progress lines). */
function extractSummaryText(stdout) {
  const lines = stdout.replace(/\r/g, '').split('\n').map((l) => l.trimEnd());
  let start = lines.findIndex((l) => l.includes('█ THRESHOLDS'));
  if (start === -1) start = lines.findIndex((l) => l.includes('█ TOTAL RESULTS'));
  if (start === -1) start = 0;
  return lines.slice(start).join('\n').replace(/\n{4,}/g, '\n\n\n').trimEnd() + '\n';
}

function extractMetrics(test, exported) {
  const m = exported.metrics;
  const latency = m[test.metric] ?? m.http_req_duration;
  return {
    avg: latency.avg,
    min: latency.min,
    med: latency.med,
    max: latency.max,
    p90: latency['p(90)'],
    p95: latency['p(95)'],
    rps: m.http_reqs?.rate ?? 0,
    requests: m.http_reqs?.count ?? 0,
    failedRate: m.http_req_failed?.value ?? 0,
    checksRate: m.checks?.value ?? 0,
  };
}

// --- Summary persistence ---

function loadSummary() {
  if (!existsSync(SUMMARY_FILE)) return { tests: {} };
  return JSON.parse(readFileSync(SUMMARY_FILE, 'utf8'));
}

function saveSummary(summary) {
  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2) + '\n');
}

function environmentInfo() {
  const info = docker(['info', '--format', '{{json .}}']).stdout;
  const d = JSON.parse(info);
  const k6 = sh('k6', ['version'], { allowFail: true }).stdout?.trim().split(' ')[1];
  return {
    platform: `${os.platform()} ${os.release()}`,
    arch: os.arch(),
    cpu: os.cpus()[0]?.model,
    cpus: os.cpus().length,
    memoryGB: Math.round(os.totalmem() / 1024 ** 3),
    docker: { version: d.ServerVersion, cpus: d.NCPU, memoryGB: Math.round(d.MemTotal / 1024 ** 3) },
    k6,
    node: process.version,
  };
}

// --- Commands ---

function preflight({ needK6 }) {
  step('Preflight');
  const dockerRes = docker(['info', '--format', '{{.ServerVersion}}'], { allowFail: true });
  if (dockerRes.status !== 0) throw new Error('Docker daemon is not reachable, start Docker first');
  ok(`Docker ${dockerRes.stdout.trim()}`);

  if (needK6) {
    const k6 = spawnSync('k6', ['version'], { encoding: 'utf8' });
    if (k6.error || k6.status !== 0) throw new Error('k6 is not installed (https://k6.io)');
    ok(k6.stdout.trim().split('\n')[0]);
  }
  cleanupStaleContainers();
}

function listCommand() {
  for (const service of SERVICES) {
    log(`${service.id.padEnd(13)} ${service.image}  ${(service.cmd ?? []).join(' ')}`);
    for (const test of TESTS.filter((t) => t.service === service)) {
      log(`  - ${test.id.padEnd(18)} ${test.conversion.padEnd(11)} ${test.script}`);
    }
  }
}

async function processServices(tests, opts, { benchmark }) {
  const summary = loadSummary();
  const env = benchmark ? environmentInfo() : null;
  const outcomes = [];

  for (const { service, tests: serviceTests } of groupByService(tests)) {
    step(`${service.id} (${service.image}${service.cmd ? ' ' + service.cmd.join(' ') : ''})`);
    let name;
    try {
      ensureImage(service, opts.pull);
      name = await startContainer(service);
      const ready = await waitUntilReady(serviceTests[0], opts.readyTimeout);
      ok(`ready (first conversion in ${ready.ms}ms)`);
      const image = imageInfo(service.image);

      for (const [index, test] of serviceTests.entries()) {
        const record = {
          id: test.id,
          service: service.id,
          tool: service.tool,
          version: service.version,
          conversion: test.conversion,
          engine: test.engine,
          threads: service.threads,
          threadsUnit: service.threadsUnit ?? 'thread',
          command: (service.cmd ?? []).join(' '),
          image,
          date: new Date().toISOString(),
        };
        try {
          record.verify = await verifyTest(test);
          if (!benchmark) { outcomes.push({ id: test.id, ok: true }); continue; }

          if (index > 0 && opts.cooldown) await sleep(opts.cooldown * 1000);
          await warmup(test, opts.warmup);
          const { thresholdsPassed, export: exported } = await runK6(test, opts);
          record.vus = opts.vus;
          record.duration = opts.duration;
          record.warmup = opts.warmup;
          record.metrics = extractMetrics(test, exported);
          record.status = thresholdsPassed ? 'passed' : 'thresholds_failed';
          const m = record.metrics;
          (thresholdsPassed ? ok : warn)(
            `${test.id}: avg=${m.avg.toFixed(2)}ms rps=${m.rps.toFixed(2)} failed=${(m.failedRate * 100).toFixed(2)}%` +
            (thresholdsPassed ? '' : ' (k6 thresholds failed)'),
          );
          outcomes.push({ id: test.id, ok: true });
        } catch (err) {
          record.status = 'failed';
          record.error = err.message;
          fail(`${test.id}: ${err.message}`);
          outcomes.push({ id: test.id, ok: false, error: err.message });
        }
        if (benchmark) {
          summary.tests[test.id] = record;
          summary.environment = env;
          summary.updatedAt = new Date().toISOString();
          saveSummary(summary);
        }
      }
    } catch (err) {
      fail(err.message);
      if (name) warn(`container logs saved to ${saveContainerLogs(name)}`);
      const error = err.message.split('\n')[0];
      for (const test of serviceTests) outcomes.push({ id: test.id, ok: false, error });
    } finally {
      stopContainer(name);
    }
  }
  return outcomes;
}

function printOutcomes(outcomes) {
  step('Summary');
  for (const o of outcomes) (o.ok ? ok : fail)(o.ok ? o.id : `${o.id}: ${o.error}`);
  const failed = outcomes.filter((o) => !o.ok).length;
  log(`\n${outcomes.length - failed}/${outcomes.length} tests succeeded`);
  return failed;
}

function shutdown(signal) {
  log(`\nReceived ${signal}, cleaning up...`);
  currentK6?.kill('SIGINT');
  stopContainer(currentContainer);
  process.exit(130);
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    allowNegative: true,
    options: {
      only: { type: 'string' },
      duration: { type: 'string', default: '1m' },
      vus: { type: 'string', default: '5' },
      warmup: { type: 'string', default: '10' },
      cooldown: { type: 'string', default: '5' },
      'ready-timeout': { type: 'string', default: '300' },
      pull: { type: 'boolean', default: false },
      report: { type: 'boolean', default: true },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  const command = positionals[0];
  if (values.help || !command) { log(USAGE); return 0; }

  const opts = {
    duration: values.duration,
    vus: Number(values.vus),
    warmup: Number(values.warmup),
    cooldown: Number(values.cooldown),
    readyTimeout: Number(values['ready-timeout']),
    pull: values.pull,
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  switch (command) {
    case 'list':
      listCommand();
      return 0;
    case 'verify': {
      const tests = selectTests(values.only);
      preflight({ needK6: false });
      return printOutcomes(await processServices(tests, opts, { benchmark: false })) ? 1 : 0;
    }
    case 'run': {
      const tests = selectTests(values.only);
      preflight({ needK6: true });
      const failed = printOutcomes(await processServices(tests, opts, { benchmark: true }));
      if (values.report) {
        step('Report');
        generateReport(loadSummary(), ROOT).forEach((file) => ok(`updated ${file}`));
      }
      return failed ? 1 : 0;
    }
    case 'report':
      generateReport(loadSummary(), ROOT).forEach((file) => ok(`updated ${file}`));
      return 0;
    default:
      log(`Unknown command "${command}"\n`);
      log(USAGE);
      return 1;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    fail(err.message);
    stopContainer(currentContainer);
    process.exit(1);
  },
);
