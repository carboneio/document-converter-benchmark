import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { sleep } from 'k6';

// --- Load options ---
// Adjust vus/duration as you like
export const options = {
  vus: Number(__ENV.VUS || 5),           // number of concurrent "virtual users"
  duration: __ENV.DURATION || '1m',     // how long to run the test
  thresholds: {
    http_req_duration: ['p(95)<5000'],        // 95% of requests < 5s
    http_req_failed: ['rate<0.01'],           // < 1% failures
    pandoc_html_latency: ['p(95)<5000'],      // custom metric threshold
  },
};

// Custom metric to track pandoc latency explicitly
const pandocHtmlLatency = new Trend('pandoc_html_latency');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3030';
const url = `${BASE_URL}/html-to-pdf`;
// k6 reads the file once at init time and reuses the buffer
const fileData = open('./sample.html');

// MIME type for HTML
const HTML_MIME = 'text/html';

export default function () {
  // The pandoc wrapper reads the raw request body as the input document
  const res = http.post(url, fileData, {
    headers: { 'Content-Type': HTML_MIME },
  });

  // Record latency
  pandocHtmlLatency.add(res.timings.duration);

  // Basic checks: status code & some timing sanity
  check(res, {
    'status is 200': (r) => r.status === 200,
    'duration < 10s': (r) => r.timings.duration < 10000,
  });

}
