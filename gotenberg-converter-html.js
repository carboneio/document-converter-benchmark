import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { sleep } from 'k6';

// --- Load options ---
// Adjust vus/duration as you like
export const options = {
  vus: 5,              // number of concurrent "virtual users"
  duration: '1m',      // how long to run the test
  thresholds: {
    http_req_duration: ['p(95)<5000'],        // 95% of requests < 5s
    http_req_failed: ['rate<0.01'],           // < 1% failures
    gotenberg_html_latency: ['p(95)<5000'],     // custom metric threshold
  }
};

// Custom metric to track gotenberg latency explicitly
const gotenbergHtmlLatency = new Trend('gotenberg_html_latency');

const url = 'http://localhost:4000/forms/chromium/convert/html';
// k6 reads the file once at init time and reuses the buffer
const fileData = open('./sample.html');

// MIME type for DOCX
const HTML_MIME =
  'text/html';

export default function () {
  // According to Gotenberg API, the field name for the file must match the expected file input name,
  // which is "index.html" for single HTML input, not "files". Only send the file with the right field/key.
  const formData = {
    'index.html': http.file(fileData, 'index.html', HTML_MIME),
  };

  const res = http.post(url, formData);

  // Record latency
  gotenbergHtmlLatency.add(res.timings.duration);

  // Basic checks: status code & some timing sanity
  check(res, {
    'status is 200': (r) => r.status === 200,
    'duration < 10s': (r) => r.timings.duration < 10000,
  });

}
