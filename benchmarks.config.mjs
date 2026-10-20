import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const HTML_MIME = 'text/html';

const sampleDocx = () => readFileSync(join(ROOT, 'sample.docx'));
const sampleHtml = () => readFileSync(join(ROOT, 'sample.html'));

// --- Verification request builders (mirror the curl commands of the README) ---

const multipart = (path, field, filename, mime, read) => (baseUrl) => {
  const form = new FormData();
  form.append(field, new Blob([read()], { type: mime }), filename);
  return { url: baseUrl + path, init: { method: 'POST', body: form } };
};

const rawBody = (path, mime, read) => (baseUrl) => ({
  url: baseUrl + path,
  init: { method: 'POST', body: read(), headers: { 'Content-Type': mime } },
});

const carboneJson = (mime, read, extra = {}) => (baseUrl) => ({
  url: baseUrl + '/render/template?download=true',
  init: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {},
      template: `data:${mime};base64,${read().toString('base64')}`,
      convertTo: 'pdf',
      ...extra,
    }),
  },
});

// --- Report settings per tool (chart color, label in the docs) ---
// The order of this object is the order of the sections in RESULT.md.

export const TOOLS = {
  'Jod-converter': { color: '#d62728', short: 'Jod', imageLabel: 'Jod-converter' },
  Collabora: { color: '#ff7f0e', imageLabel: 'Collabora' },
  Carbone: { color: '#A644C5', bold: true, imageLabel: 'Carbone Community Edition (Free Edition)' },
  Gotenberg: { color: '#358BBA', imageLabel: 'Gotenberg' },
  Pandoc: {
    color: '#2ca02c',
    imageLabel: 'Pandoc',
    imageNote: 'wrapped with a minimal HTTP server, see [`pandoc/`](pandoc/)',
  },
};

const CARBONE_IMAGE = 'carbone/carbone-ee:full-5.16.0';
const GOTENBERG_IMAGE = 'gotenberg/gotenberg:8.38.1';
const COLLABORA_IMAGE = 'collabora/code:latest';
const JOD_IMAGE = 'ghcr.io/jodconverter/jodconverter-examples:rest';
const PANDOC_IMAGE = 'pandoc-bench';

// --- Tests shared by several services ---

const jodDocx = {
  conversion: 'DOCX → PDF',
  engine: 'libreoffice',
  script: 'jod-converter.js',
  metric: 'jodconverter_latency',
  verify: multipart('/lool/convert-to/pdf', 'data', 'sample.docx', DOCX_MIME, sampleDocx),
};

const collaboraDocx = {
  conversion: 'DOCX → PDF',
  engine: 'libreoffice',
  script: 'collabora-converter.js',
  metric: 'collabora_latency',
  verify: multipart('/cool/convert-to/pdf', 'data', 'sample.docx', DOCX_MIME, sampleDocx),
};

const carboneDocx = {
  conversion: 'DOCX → PDF',
  engine: 'libreoffice',
  script: 'carbone-converter.js',
  metric: 'carbone_latency',
  verify: carboneJson(DOCX_MIME, sampleDocx),
};

const carboneHtml = {
  conversion: 'HTML → PDF',
  engine: 'chrome',
  script: 'carbone-converter-html.js',
  metric: 'carbone_html_latency',
  verify: carboneJson(HTML_MIME, sampleHtml, { converter: 'C' }),
};

const gotenbergHtml = {
  conversion: 'HTML → PDF',
  engine: 'chrome',
  script: 'gotenberg-converter-html.js',
  metric: 'gotenberg_html_latency',
  verify: multipart('/forms/chromium/convert/html', 'files', 'index.html', HTML_MIME, sampleHtml),
};

const gotenbergDocx = {
  conversion: 'DOCX → PDF',
  engine: 'libreoffice',
  script: 'gotenberg-converter.js',
  metric: 'gotenberg_latency',
  verify: multipart('/forms/libreoffice/convert', 'files', 'sample.docx', DOCX_MIME, sampleDocx),
};

const collaboraParams = (n) =>
  `--o:ssl.enable=false --o:ssl.termination=true --o:per_document.max_concurrency=${n} --o:num_prespawn_children=${n}`;

/**
 * A service is one container configuration; it carries one or more tests.
 * - ports: [hostPort, containerPort] (optionally bound to `bind`)
 * - dockerArgs: extra `docker run` arguments placed before the image
 * - cmd: arguments placed after the image
 * - build: `docker build` executed before running the service
 * - platform: forced image platform, for images without an arm64 variant (emulated on Apple Silicon)
 */
export const SERVICES = [
  {
    id: 'jod-1',
    tool: 'Jod-converter',
    threads: 1,
    image: JOD_IMAGE,
    platform: 'linux/amd64',
    ports: [8080, 8080],
    dockerArgs: ['-v', `${join(ROOT, 'jod/application-1.properties')}:/etc/app/application.properties:ro`],
    tests: [jodDocx],
  },
  {
    id: 'jod-4',
    tool: 'Jod-converter',
    threads: 4,
    image: JOD_IMAGE,
    platform: 'linux/amd64',
    ports: [8080, 8080],
    dockerArgs: ['-v', `${join(ROOT, 'jod/application-4.properties')}:/etc/app/application.properties:ro`],
    tests: [jodDocx],
  },
  {
    id: 'collabora-1',
    tool: 'Collabora',
    threads: 1,
    image: COLLABORA_IMAGE,
    ports: [9980, 9980],
    bind: '127.0.0.1',
    dockerArgs: ['--privileged', '-t', '-e', `extra_params=${collaboraParams(1)}`],
    tests: [collaboraDocx],
  },
  {
    id: 'collabora-4',
    tool: 'Collabora',
    threads: 4,
    image: COLLABORA_IMAGE,
    ports: [9980, 9980],
    bind: '127.0.0.1',
    dockerArgs: ['--privileged', '-t', '-e', `extra_params=${collaboraParams(4)}`],
    tests: [collaboraDocx],
  },
  {
    id: 'carbone-1',
    tool: 'Carbone',
    version: '5.16.0',
    threads: 1,
    image: CARBONE_IMAGE,
    ports: [4000, 4000],
    cmd: ['webserver', '-s', '-f', '1'],
    tests: [carboneDocx, carboneHtml],
  },
  {
    id: 'carbone-4',
    tool: 'Carbone',
    version: '5.16.0',
    threads: 4,
    image: CARBONE_IMAGE,
    ports: [4000, 4000],
    cmd: ['webserver', '-s', '-f', '4'],
    tests: [carboneDocx, carboneHtml],
  },
  {
    id: 'gotenberg-1',
    tool: 'Gotenberg',
    version: '8.38.1',
    threads: 1,
    threadsUnit: 'concurrency',
    image: GOTENBERG_IMAGE,
    ports: [4000, 3000],
    cmd: ['gotenberg', '--chromium-auto-start=true'],
    tests: [gotenbergHtml, gotenbergDocx],
  },
  {
    id: 'gotenberg-4',
    tool: 'Gotenberg',
    version: '8.38.1',
    threads: 4,
    threadsUnit: 'concurrency',
    image: GOTENBERG_IMAGE,
    ports: [4000, 3000],
    cmd: ['gotenberg', '--chromium-max-concurrency=4', '--chromium-auto-start=true'],
    tests: [gotenbergHtml],
  },
  {
    id: 'pandoc',
    tool: 'Pandoc',
    threads: null,
    image: PANDOC_IMAGE,
    platform: 'linux/amd64',
    build: { tag: PANDOC_IMAGE, context: join(ROOT, 'pandoc') },
    ports: [3030, 3030],
    tests: [
      {
        conversion: 'HTML → PDF',
        engine: 'latex',
        script: 'pandoc-converter-html.js',
        metric: 'pandoc_html_latency',
        verify: rawBody('/html-to-pdf', HTML_MIME, sampleHtml),
      },
      {
        conversion: 'DOCX → PDF',
        engine: 'latex',
        script: 'pandoc-converter.js',
        metric: 'pandoc_latency',
        verify: rawBody('/docx-to-pdf', DOCX_MIME, sampleDocx),
      },
    ],
  },
];

/** Flattened list of tests, each one linked to its service. */
export const TESTS = SERVICES.flatMap((service) =>
  service.tests.map((test) => {
    const format = test.conversion.startsWith('HTML') ? 'html' : 'docx';
    return { ...test, id: `${service.id}-${format}`, format, service };
  }),
);
