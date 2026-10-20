FROM pandoc/latex:latest

# pandoc/latex is Alpine-based; add Python for the tiny HTTP wrapper
RUN apk add --no-cache python3

COPY server.py /server.py

EXPOSE 3030

# Override the default `pandoc` entrypoint with our HTTP wrapper
ENTRYPOINT ["python3", "/server.py"]
