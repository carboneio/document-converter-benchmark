import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { TESTS, TOOLS } from './benchmarks.config.mjs';

// Results with more failed requests than this are errors, not conversions, and are not reported
export const MAX_FAILED_RATE = 0.01;

const ENGINE_NAMES = { libreoffice: 'LibreOffice', chrome: 'Chrome', latex: 'LaTeX', ice: 'Carbone ICE' };

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// --- Formatting helpers ---

const ms = (value) => `${value.toFixed(2)}ms`;
const rps = (value) => value.toFixed(2);
const toolInfo = (tool) => TOOLS[tool] ?? { color: '#7f7f7f' };
const shortName = (tool) => toolInfo(tool).short ?? tool;

function ordinalDate(iso) {
  const d = new Date(iso);
  const day = d.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  return `${MONTHS[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
}

function durationSeconds(duration) {
  const units = { ms: 0.001, s: 1, m: 60, h: 3600 };
  let total = 0;
  for (const [, n, unit] of String(duration).matchAll(/(\d+(?:\.\d+)?)(ms|s|m|h)/g)) total += Number(n) * units[unit];
  return total;
}

/** "4 threads", "1 thread", "4 concurrency", or "" when the tool has no thread setting. */
function threadsLong(r) {
  if (r.threads == null) return '';
  const unit = r.threadsUnit === 'thread' && r.threads > 1 ? 'threads' : r.threadsUnit;
  return `${r.threads} ${unit}`;
}

const threadsShort = (r) => `${r.threads ?? 'n/a'} (${r.engine})`;
const conversionWords = (r) => r.conversion.replace('→', 'to');
const engineName = (r) => ENGINE_NAMES[r.engine] ?? r.engine;
const toolLabel = (r) => (r.chartTag ? `${r.tool} ${r.chartTag}` : r.tool);
const chartLabel = (r) =>
  [`${shortName(r.tool)} ${conversionWords(r)}${r.chartTag ? ` (${r.chartTag})` : ''}`, threadsLong(r)]
    .filter(Boolean)
    .join(' / ');

const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Successful results of the tests still declared in the config, sorted by throughput.
 * Display settings (headline, chartTag) always come from the current config, not from the stored result.
 */
function measured(summary) {
  const tests = new Map(TESTS.map((t) => [t.id, t]));
  return Object.values(summary.tests ?? {})
    .filter((r) => tests.has(r.id) && r.metrics && r.status !== 'failed' && r.metrics.failedRate < MAX_FAILED_RATE)
    .map((r) => ({ ...r, headline: tests.get(r.id).headline !== false, chartTag: tests.get(r.id).chartTag }))
    .sort((a, b) => b.metrics.rps - a.metrics.rps);
}

function markdownTable(header, rows) {
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)));
  const line = (cells) => `| ${cells.map((c, i) => c.padEnd(widths[i])).join(' | ')} |`;
  return [line(header), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
}

function replaceBlock(content, name, body) {
  const pattern = new RegExp(`(<!-- BENCH:${name}:START -->)[\\s\\S]*?(<!-- BENCH:${name}:END -->)`);
  if (!pattern.test(content)) throw new Error(`README.md is missing the <!-- BENCH:${name}:START/END --> markers`);
  return content.replace(pattern, (_, start, end) => `${start}\n${body.trim()}\n${end}`);
}

// --- README sections ---

function summarySection(rows, missing) {
  const table = markdownTable(
    ['Tool', 'Threads', 'Conversion', 'Avg Latency', 'Throughput (RPS)'],
    rows.map((r) => [`**${r.tool}**`, threadsShort(r), r.conversion, ms(r.metrics.avg), rps(r.metrics.rps)]),
  );

  const top = rows[0];
  const conversions = [...new Set(rows.map((r) => r.conversion))];
  const leadsEverywhere = conversions.every((c) => rows.find((r) => r.conversion === c).tool === top.tool);
  const where = `for ${conversionWords(top)} conversions${top.threads ? ` (${threadsLong(top)})` : ''}`;
  const finding = leadsEverywhere
    ? `> 💡 **Key Finding**: ${top.tool} consistently outperforms other solutions, achieving up to **${rps(top.metrics.rps)} RPS** ${where}.`
    : `> 💡 **Key Finding**: ${top.tool} delivers the highest throughput, achieving up to **${rps(top.metrics.rps)} RPS** ${where}.`;

  const parts = [table, '', finding];
  if (missing.length) {
    parts.push('', `> ⚠️ Not measured (not run yet, or conversion check or benchmark failed): ${missing.map((id) => `\`${id}\``).join(', ')}.`);
  }
  return parts.join('\n');
}

function conversionLeader(rows, conversion, icon, title) {
  const list = rows.filter((r) => r.conversion === conversion).sort((a, b) => a.metrics.avg - b.metrics.avg);
  if (list.length === 0) return null;
  const best = list[0];
  const runnerUp = list.find((r) => r.tool !== best.tool);
  const bestText = `${ms(best.metrics.avg)}${best.threads ? ` (${threadsLong(best)})` : ''}`;
  return runnerUp
    ? `- ${icon} **${title}**: ${toolLabel(best)} leads with ${bestText} vs ${ms(runnerUp.metrics.avg)} (${toolLabel(runnerUp)})`
    : `- ${icon} **${title}**: ${toolLabel(best)} with ${bestText}`;
}

function insightsSection(rows) {
  const lines = [];
  const fastest = [...rows].sort((a, b) => a.metrics.avg - b.metrics.avg)[0];
  lines.push(
    `- ⚡ **Fastest Overall**: ${toolLabel(fastest)}${fastest.threads ? ` with ${threadsLong(fastest)}` : ''} ` +
    `(${ms(fastest.metrics.avg)} avg for ${fastest.conversion.replace(' → ', '→')})`,
  );

  const gains = [];
  for (const r of rows.filter((x) => x.threads > 1)) {
    const single = rows.find((x) =>
      x.tool === r.tool && x.conversion === r.conversion && x.engine === r.engine && x.threads === 1);
    if (single) gains.push({ r, ratio: r.metrics.rps / single.metrics.rps });
  }
  gains.sort((a, b) => b.ratio - a.ratio);
  if (gains.length) {
    const { r, ratio } = gains[0];
    lines.push(
      `- 🚀 **Best Scalability**: ${toolLabel(r)} gets ${ratio.toFixed(1)}x more throughput on ${r.conversion.replace(' → ', '→')} ` +
      `when going from 1 to ${threadsLong(r)}`,
    );
  }

  const docx = conversionLeader(rows, 'DOCX → PDF', '📄', 'DOCX Conversion');
  const html = conversionLeader(rows, 'HTML → PDF', '🌐', 'HTML Conversion');
  if (docx) lines.push(docx);
  if (html) lines.push(html);
  return lines.join('\n');
}

function environmentSection(summary, rows) {
  const latest = rows.map((r) => r.date).sort().at(-1) ?? summary.updatedAt;
  const images = new Map();
  for (const r of rows) if (!images.has(r.image.tag)) images.set(r.image.tag, r);
  const ordered = [...images.values()].sort(
    (a, b) => Object.keys(TOOLS).indexOf(a.tool) - Object.keys(TOOLS).indexOf(b.tool),
  );

  const env = summary.environment ?? {};
  const lines = [
    '**Software Versions:**',
    `- **Benchmark Date**: ${ordinalDate(latest)}`,
    `- **k6**: ${env.k6 ?? 'n/a'} | **Docker Engine**: ${env.docker?.version ?? 'n/a'} ` +
      `(${env.docker?.cpus ?? '?'} CPUs, ${env.docker?.memoryGB ?? '?'} GB allocated to Docker)`,
    '- **Docker Images**:',
  ];
  for (const r of ordered) {
    const info = toolInfo(r.tool);
    const details = [
      r.image.version && `version ${r.image.version}`,
      r.image.created && `built ${r.image.created}`,
      r.image.digest && `digest \`${r.image.digest}\``,
      r.image.architecture && r.image.architecture,
      info.imageNote,
    ].filter(Boolean);
    lines.push(`  - ${info.imageLabel ?? r.tool}: \`${r.image.tag}\`${details.length ? ` (${details.join(', ')})` : ''}`);
  }

  const any = rows[0];
  lines.push(
    '',
    '### Test Configuration',
    '',
    '- **Load Testing Tool**: [k6](https://k6.io) by Grafana Labs',
    `- **Test Duration**: ${durationSeconds(any?.duration ?? '1m')} seconds per configuration`,
    `- **Virtual Users**: ${any?.vus ?? 5} concurrent users`,
    `- **Warmup**: ${any?.warmup ?? 0} verified conversions before each run (excluded from the results)`,
    '- **Metrics Collected**:',
    '  - Average latency (ms)',
    '  - Requests per second (RPS)',
    '  - 95th percentile latency',
    '  - Error rates',
  );
  return lines.join('\n');
}

function writeReadme(root, summary, rows, missing) {
  const file = join(root, 'README.md');
  let content = readFileSync(file, 'utf8');
  content = replaceBlock(content, 'SUMMARY', summarySection(rows, missing));
  content = replaceBlock(content, 'INSIGHTS', insightsSection(rows));
  content = replaceBlock(content, 'ENVIRONMENT', environmentSection(summary, rows));
  writeFileSync(file, content);
  return 'README.md';
}

// --- RESULT.md ---

function writeResultMd(root, summary, rows) {
  const lines = [
    'RESULT',
    '======',
    '',
    `> Generated by \`node bench.mjs report\` from the raw k6 outputs stored in [\`results/\`](results/). ` +
      `Last update: ${ordinalDate(summary.updatedAt ?? new Date().toISOString())}.`,
    '',
    '## Summary',
    '',
    markdownTable(
      ['Tool', 'Engine', 'Threads', 'Conversion', 'Avg Latency', 'p(95)', 'Throughput (RPS)', 'In README'],
      rows.map((r) => [
        `**${r.tool}**`,
        engineName(r),
        String(r.threads ?? 'n/a'),
        r.conversion,
        ms(r.metrics.avg),
        ms(r.metrics.p95),
        rps(r.metrics.rps),
        r.headline === false ? 'no' : 'yes',
      ]),
    ),
    '',
  ];

  const toolOrder = Object.keys(TOOLS);
  const groups = new Map();
  for (const r of [...rows].sort((a, b) =>
    toolOrder.indexOf(a.tool) - toolOrder.indexOf(b.tool) ||
    a.conversion.localeCompare(b.conversion) ||
    engineName(a).localeCompare(engineName(b)) ||
    (a.threads ?? 0) - (b.threads ?? 0))) {
    const key = `${r.tool} ${r.conversion} (${engineName(r)})`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  for (const [title, list] of groups) {
    lines.push('', `# ${title}`, '');
    if (list[0].version) lines.push(`**Version**: ${list[0].version}`, '');
    for (const r of list) {
      lines.push(`## ${threadsLong(r) || 'No thread setting (one process per request)'}`, '');
      lines.push(`**Image**: \`${r.image.tag}\`${r.command ? ` — **Command**: \`${r.command}\`` : ''}`, '');
      const txt = join(root, 'results', `${r.id}.txt`);
      lines.push('```sh', existsSync(txt) ? readFileSync(txt, 'utf8').trimEnd() : '(raw k6 output not found)', '```', '');
    }
  }
  writeFileSync(join(root, 'RESULT.md'), lines.join('\n').replace(/\n{3,}/g, '\n\n'));
  return 'RESULT.md';
}

// --- result.svg ---

function niceStep(max, targetTicks = 12) {
  const rough = max / targetTicks;
  const pow = 10 ** Math.floor(Math.log10(rough));
  return [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough);
}

// Rough Arial 12px advance width; SVG cannot measure text, so labels are sized by estimate
function estimateTextWidth(text, bold) {
  return text.length * (bold ? 7.2 : 6.6);
}

function writeSvg(root, rows) {
  const longestLabel = Math.max(...rows.map((r) => estimateTextWidth(chartLabel(r), toolInfo(r.tool).bold)));
  const left = Math.max(250, Math.ceil(longestLabel + 30));
  const top = 20;
  const plotWidth = 545;
  const bandStep = 62;
  const barHeight = 50;
  const plotHeight = rows.length * bandStep;
  const legendX = left + plotWidth + 10;
  const width = legendX + 200;
  const height = top + plotHeight + 40;

  const maxRps = Math.max(...rows.map((r) => r.metrics.rps));
  const tick = niceStep(maxRps);
  const axisMax = Math.ceil(maxRps / tick) * tick;
  const x = (v) => (v / axisMax) * plotWidth;

  const bars = rows.map((r, i) =>
    `          <rect id="bar - ${escapeXml(chartLabel(r))}" x="0" y="${i * bandStep + (bandStep - barHeight) / 2}" ` +
    `height="${barHeight}" width="${x(r.metrics.rps)}" fill="${toolInfo(r.tool).color}"/>`);

  const xTicks = [];
  for (let v = 0; v <= axisMax + 1e-9; v += tick) {
    xTicks.push(
      `          <g class="tick" opacity="1" transform="translate(${x(v)},0)">\n` +
      `            <line stroke="currentColor" y2="6"/>\n` +
      `            <text fill="currentColor" y="9" dy="0.71em">${Number(v.toFixed(2))}</text>\n` +
      `          </g>`);
  }

  const yTicks = rows.map((r, i) => {
    const weight = toolInfo(r.tool).bold ? ' font-weight: bold;' : '';
    return (
      `          <g class="tick" opacity="1" transform="translate(0,${i * bandStep + bandStep / 2})">\n` +
      `            <line stroke="currentColor" x2="-6"/>\n` +
      `            <text fill="currentColor" x="-9" dy="0.32em" style="font-family: Arial, sans-serif; font-size: 12px;${weight}">${escapeXml(chartLabel(r))}</text>\n` +
      `          </g>`);
  });

  const tools = [...new Set(rows.map((r) => r.tool))];
  const legend = tools.map((t, i) => {
    const weight = toolInfo(t).bold ? 'font-weight: bold;' : '';
    return (
      `          <g class="cell" transform="translate(0, ${i * 20.5})">\n` +
      `            <rect class="swatch" height="15" width="15" style="fill: ${toolInfo(t).color};"/>\n` +
      `            <text class="label" transform="translate( 20, 12.5)" font-family="&quot;Arial&quot;, sans-serif" font-size="12px">\n` +
      `              <tspan x="0" dy="0em" style="${weight}">${escapeXml(shortName(t))}</tspan>\n` +
      `            </text>\n` +
      `          </g>`);
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" x="0" y="0" fill="#FFFFFF" id="background"/>
  <g id="viz">
    <g transform="translate(${left},${top})">
      <g class="bars">
${bars.join('\n')}
      </g>
      <g id="xAxis" transform="translate(0,${plotHeight})" fill="none" font-size="12" font-family="sans-serif" text-anchor="middle">
        <path class="domain" stroke="currentColor" d="M0,6V0H${plotWidth}V6"/>
${xTicks.join('\n')}
        <text font-family="Arial, sans-serif" font-size="12" x="${plotWidth}" dy="-5" fill="black" font-weight="bold" text-anchor="end">RPS</text>
      </g>
      <g id="yAxis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end">
        <path class="domain" stroke="currentColor" d="M0,0V${plotHeight}"/>
${yTicks.join('\n')}
      </g>
    </g>
  </g>
  <g id="legend" transform="translate(${legendX},20)">
    <g transform="translate(5,0)">
      <g class="legendColor">
        <g class="legendCells" transform="translate(0,15.5)">
${legend.join('\n')}
        </g>
        <text class="legendTitle" font-family="&quot;Arial&quot;, sans-serif" font-size="12px" font-weight="bold">
          <tspan x="0" dy="0em">Tool</tspan>
        </text>
      </g>
    </g>
  </g>
</svg>
`;
  writeFileSync(join(root, 'result.svg'), svg);
  return 'result.svg';
}

/** Regenerate README.md sections, RESULT.md and result.svg. Returns the updated files. */
export function generateReport(summary, root) {
  const rows = measured(summary);
  const headline = rows.filter((r) => r.headline !== false);
  if (headline.length === 0) throw new Error('no benchmark result found in results/summary.json, run "node bench.mjs run" first');
  const missing = TESTS.filter((t) => !rows.some((r) => r.id === t.id)).map((t) => t.id);
  return [
    writeReadme(root, summary, headline, missing),
    writeResultMd(root, summary, rows),
    writeSvg(root, headline),
  ];
}
