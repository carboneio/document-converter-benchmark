import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

// --- Load options ---
// Adjust vus/duration as you like
export const options = {
  vus: Number(__ENV.VUS || 5),           // number of concurrent "virtual users"
  duration: __ENV.DURATION || '1m',     // how long to run the test
  thresholds: {
    http_req_duration: ['p(95)<5000'],        // 95% of requests < 5s
    http_req_failed: ['rate<0.01'],           // < 1% failures
    gotenberg_latency: ['p(95)<5000'],     // custom metric threshold
  },
};

// Custom metric to track Gotenberg latency explicitly
const gotenbergLatency = new Trend('gotenberg_latency');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const url = `${BASE_URL}/forms/libreoffice/convert`;
// k6 reads the file once at init time and reuses the buffer
const fileData = open('./sample.docx', 'b');

// MIME type for DOCX
const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export default function () {
  const formData = {
    files: http.file(fileData, 'sample.docx', DOCX_MIME),
  };

  const res = http.post(url, formData);

  // Record latency
  gotenbergLatency.add(res.timings.duration);

  // Basic checks: status code & some timing sanity
  check(res, {
    'status is 200': (r) => r.status === 200,
    'duration < 10s': (r) => r.timings.duration < 10000,
  });

}
