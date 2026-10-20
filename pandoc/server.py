#!/usr/bin/env python3
"""Minimal HTTP wrapper around the pandoc CLI so it can be benchmarked with k6.

pandoc's built-in server (`pandoc --server`) cannot produce PDF because that
requires running an external PDF engine (LaTeX), which the sandboxed server
refuses to do. This tiny wrapper shells out to the pandoc CLI instead, which
has access to the LaTeX engine bundled in the `pandoc/latex` image.

Routes (POST, raw request body = input document):
  /html-to-pdf  -> converts an HTML body to PDF
  /docx-to-pdf  -> converts a DOCX body to PDF
"""
import os
import subprocess
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "3030"))

# URL path -> (pandoc input format, temp input filename)
ROUTES = {
    "/html-to-pdf": ("html", "input.html"),
    "/docx-to-pdf": ("docx", "input.docx"),
}


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        route = ROUTES.get(self.path)
        if route is None:
            self.send_error(404, "Unknown route")
            return

        from_format, in_name = route
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)

        workdir = tempfile.mkdtemp(prefix="pandoc-")
        in_path = os.path.join(workdir, in_name)
        out_path = os.path.join(workdir, "output.pdf")
        try:
            with open(in_path, "wb") as fh:
                fh.write(body)

            result = subprocess.run(
                ["pandoc", in_path, "-f", from_format, "-o", out_path],
                capture_output=True,
            )
            if result.returncode != 0 or not os.path.exists(out_path):
                self.log_message(
                    "pandoc failed: %s", result.stderr.decode(errors="replace")
                )
                self.send_error(500, "pandoc conversion failed")
                return

            with open(out_path, "rb") as fh:
                pdf = fh.read()

            self.send_response(200)
            self.send_header("Content-Type", "application/pdf")
            self.send_header("Content-Length", str(len(pdf)))
            self.end_headers()
            self.wfile.write(pdf)
        finally:
            for path in (in_path, out_path):
                try:
                    os.remove(path)
                except OSError:
                    pass
            try:
                os.rmdir(workdir)
            except OSError:
                pass

    def log_message(self, fmt, *args):
        # Keep the benchmark output clean; only errors go through send_error.
        pass


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"pandoc HTTP wrapper listening on :{PORT}", flush=True)
    server.serve_forever()
