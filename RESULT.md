RESULT
======


# Jod-converter

## 1 thread

```sh
  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<5000' p(95)=335.49ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%

    jodconverter_latency
    ✓ 'p(95)<5000' p(95)=335.4949


  █ TOTAL RESULTS

    checks_total.......: 2000    32.299696/s
    checks_succeeded...: 100.00% 2000 out of 2000
    checks_failed......: 0.00%   0 out of 2000

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    jodconverter_latency...........: avg=305.419167 min=133.385  med=259.056  max=2017.888 p(90)=299.1918 p(95)=335.4949

    HTTP
    http_req_duration..............: avg=305.41ms   min=133.38ms med=259.05ms max=2.01s    p(90)=299.19ms p(95)=335.49ms
      { expected_response:true }...: avg=305.41ms   min=133.38ms med=259.05ms max=2.01s    p(90)=299.19ms p(95)=335.49ms
    http_req_failed................: 0.00% 0 out of 1000
    http_reqs......................: 1000  16.149848/s

    EXECUTION
    iteration_duration.............: avg=305.67ms   min=136.54ms med=259.33ms max=2.01s    p(90)=299.4ms  p(95)=335.67ms
    iterations.....................: 1000  16.149848/s
    vus............................: 3     min=3         max=5
    vus_max........................: 5     min=5         max=5

    NETWORK
    data_received..................: 63 MB 1.0 MB/s
    data_sent......................: 33 MB 537 kB/s

running (1m01.9s), 0/5 VUs, 1000 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
``` 


## 4 thread


```sh 

  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<5000' p(95)=115.44ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%

    jodconverter_latency
    ✓ 'p(95)<5000' p(95)=115.44505


  █ TOTAL RESULTS

    checks_total.......: 6468    107.677994/s
    checks_succeeded...: 100.00% 6468 out of 6468
    checks_failed......: 0.00%   0 out of 6468

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    jodconverter_latency...........: avg=92.582724 min=55.038  med=75.5965 max=1937.543 p(90)=104.4667 p(95)=115.44505

    HTTP
    http_req_duration..............: avg=92.58ms   min=55.03ms med=75.59ms max=1.93s    p(90)=104.46ms p(95)=115.44ms
      { expected_response:true }...: avg=92.58ms   min=55.03ms med=75.59ms max=1.93s    p(90)=104.46ms p(95)=115.44ms
    http_req_failed................: 0.00%  0 out of 3234
    http_reqs......................: 3234   53.838997/s

    EXECUTION
    iteration_duration.............: avg=92.8ms    min=55.15ms med=75.81ms max=1.93s    p(90)=104.65ms p(95)=115.64ms
    iterations.....................: 3234   53.838997/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 203 MB 3.4 MB/s
    data_sent......................: 108 MB 1.8 MB/s




running (1m00.1s), 0/5 VUs, 3234 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

```



# Collabora

## 1 thread

```sh
 █ THRESHOLDS

    collabora_latency
    ✓ 'p(95)<5000' p(95)=73.84725

    http_req_duration
    ✓ 'p(95)<5000' p(95)=73.84ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 8760    145.853711/s
    checks_succeeded...: 100.00% 8760 out of 8760
    checks_failed......: 0.00%   0 out of 8760

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    collabora_latency..............: avg=68.169667 min=61.087  med=67.2825 max=187.321  p(90)=71.8326 p(95)=73.84725

    HTTP
    http_req_duration..............: avg=68.16ms   min=61.08ms med=67.28ms max=187.32ms p(90)=71.83ms p(95)=73.84ms
      { expected_response:true }...: avg=68.16ms   min=61.08ms med=67.28ms max=187.32ms p(90)=71.83ms p(95)=73.84ms
    http_req_failed................: 0.00%  0 out of 4380
    http_reqs......................: 4380   72.926856/s

    EXECUTION
    iteration_duration.............: avg=68.51ms   min=61.4ms  med=67.64ms max=193.23ms p(90)=72.17ms p(95)=74.2ms
    iterations.....................: 4380   72.926856/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 294 MB 4.9 MB/s
    data_sent......................: 146 MB 2.4 MB/s




running (1m00.1s), 0/5 VUs, 4380 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

``` 


## 4 thread

```sh

  █ THRESHOLDS

    collabora_latency
    ✓ 'p(95)<5000' p(95)=76.0783

    http_req_duration
    ✓ 'p(95)<5000' p(95)=76.07ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 8470    141.106746/s
    checks_succeeded...: 100.00% 8470 out of 8470
    checks_failed......: 0.00%   0 out of 8470

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    collabora_latency..............: avg=70.515843 min=60.582  med=70.027  max=109.556  p(90)=74.282  p(95)=76.0783

    HTTP
    http_req_duration..............: avg=70.51ms   min=60.58ms med=70.02ms max=109.55ms p(90)=74.28ms p(95)=76.07ms
      { expected_response:true }...: avg=70.51ms   min=60.58ms med=70.02ms max=109.55ms p(90)=74.28ms p(95)=76.07ms
    http_req_failed................: 0.00%  0 out of 4235
    http_reqs......................: 4235   70.553373/s

    EXECUTION
    iteration_duration.............: avg=70.85ms   min=60.88ms med=70.35ms max=112.69ms p(90)=74.59ms p(95)=76.44ms
    iterations.....................: 4235   70.553373/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 284 MB 4.7 MB/s
    data_sent......................: 141 MB 2.3 MB/s




running (1m00.0s), 0/5 VUs, 4235 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```



# Carbone

**Version**: 5.8.0

## 1 thread

```sh

  █ THRESHOLDS

    carbone_latency
    ✓ 'p(95)<5000' p(95)=46.6076

    http_req_duration
    ✓ 'p(95)<5000' p(95)=46.6ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 14430   240.337236/s
    checks_succeeded...: 100.00% 14430 out of 14430
    checks_failed......: 0.00%   0 out of 14430

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_latency................: avg=41.44306 min=29.944  med=40.456  max=284.564  p(90)=44.7664 p(95)=46.6076

    HTTP
    http_req_duration..............: avg=41.44ms  min=29.94ms med=40.45ms max=284.56ms p(90)=44.76ms p(95)=46.6ms
      { expected_response:true }...: avg=41.44ms  min=29.94ms med=40.45ms max=284.56ms p(90)=44.76ms p(95)=46.6ms
    http_req_failed................: 0.00%  0 out of 7215
    http_reqs......................: 7215   120.168618/s

    EXECUTION
    iteration_duration.............: avg=41.58ms  min=29.99ms med=40.59ms max=284.7ms  p(90)=44.9ms  p(95)=46.75ms
    iterations.....................: 7215   120.168618/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 133 MB 2.2 MB/s
    data_sent......................: 2.2 MB 36 kB/s




running (1m00.0s), 0/5 VUs, 7215 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
``` 


## 4 thread


```sh
  █ THRESHOLDS

    carbone_latency
    ✓ 'p(95)<5000' p(95)=19.55215

    http_req_duration
    ✓ 'p(95)<5000' p(95)=19.55ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 38476   641.135704/s
    checks_succeeded...: 100.00% 38476 out of 38476
    checks_failed......: 0.00%   0 out of 38476

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_latency................: avg=15.487893 min=11.831  med=14.814  max=131.74   p(90)=18.2093 p(95)=19.55215

    HTTP
    http_req_duration..............: avg=15.48ms   min=11.83ms med=14.81ms max=131.74ms p(90)=18.2ms  p(95)=19.55ms
      { expected_response:true }...: avg=15.48ms   min=11.83ms med=14.81ms max=131.74ms p(90)=18.2ms  p(95)=19.55ms
    http_req_failed................: 0.00%  0 out of 19238
    http_reqs......................: 19238  320.567852/s

    EXECUTION
    iteration_duration.............: avg=15.58ms   min=11.91ms med=14.9ms  max=131.9ms  p(90)=18.31ms p(95)=19.67ms
    iterations.....................: 19238  320.567852/s
    vus............................: 5      min=5          max=5
    vus_max........................: 5      min=5          max=5

    NETWORK
    data_received..................: 353 MB 5.9 MB/s
    data_sent......................: 5.8 MB 96 kB/s


running (1m00.0s), 0/5 VUs, 19238 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```


# Gotenberg LibreOffice DOCX to PDF

## 1 concurrency

```sh
 █ THRESHOLDS

    gotenberg_latency
    ✓ 'p(95)<5000' p(95)=767.092

    http_req_duration
    ✓ 'p(95)<5000' p(95)=767.09ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 930     15.320179/s
    checks_succeeded...: 100.00% 930 out of 930
    checks_failed......: 0.00%   0 out of 930

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    gotenberg_latency..............: avg=649.99852 min=434.557  med=656.539  max=882.164  p(90)=755.029  p(95)=767.092

    HTTP
    http_req_duration..............: avg=649.99ms  min=434.55ms med=656.53ms max=882.16ms p(90)=755.02ms p(95)=767.09ms
      { expected_response:true }...: avg=649.99ms  min=434.55ms med=656.53ms max=882.16ms p(90)=755.02ms p(95)=767.09ms
    http_req_failed................: 0.00% 0 out of 465
    http_reqs......................: 465   7.66009/s

    EXECUTION
    iteration_duration.............: avg=650.29ms  min=437.95ms med=659.3ms  max=884.97ms p(90)=755.45ms p(95)=767.26ms
    iterations.....................: 465   7.66009/s
    vus............................: 5     min=5        max=5
    vus_max........................: 5     min=5        max=5

    NETWORK
    data_received..................: 22 MB 369 kB/s
    data_sent......................: 16 MB 255 kB/s




running (1m00.7s), 0/5 VUs, 465 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```

# Gotenberg Chrome HTML to PDF


## 1 concurrency

**Version**: 8.33.0 —  `--chromium-auto-start=true`

```sh

  █ THRESHOLDS

    gotenberg_html_latency
    ✓ 'p(95)<5000' p(95)=160.4018

    http_req_duration
    ✓ 'p(95)<5000' p(95)=160.4ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 4540    75.601818/s
    checks_succeeded...: 100.00% 4540 out of 4540
    checks_failed......: 0.00%   0 out of 4540

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    gotenberg_html_latency.........: avg=132.071269 min=90.372  med=125.2675 max=318.572  p(90)=142.8693 p(95)=160.4018

    HTTP
    http_req_duration..............: avg=132.07ms   min=90.37ms med=125.26ms max=318.57ms p(90)=142.86ms p(95)=160.4ms
      { expected_response:true }...: avg=132.07ms   min=90.37ms med=125.26ms max=318.57ms p(90)=142.86ms p(95)=160.4ms
    http_req_failed................: 0.00%  0 out of 2270
    http_reqs......................: 2270   37.800909/s

    EXECUTION
    iteration_duration.............: avg=132.23ms   min=90.51ms med=125.39ms max=318.7ms  p(90)=143.04ms p(95)=161.37ms
    iterations.....................: 2270   37.800909/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 75 MB  1.2 MB/s
    data_sent......................: 8.1 MB 135 kB/s




running (1m00.1s), 0/5 VUs, 2270 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```

## 4 concurrency Chrome HTML to PDF

**Version**: 8.33.0 — `--chromium-max-concurrency=4`, `--chromium-auto-start=true`

```sh
  █ THRESHOLDS

    gotenberg_html_latency
    ✓ 'p(95)<5000' p(95)=195.2275

    http_req_duration
    ✓ 'p(95)<5000' p(95)=195.22ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 4342    72.233849/s
    checks_succeeded...: 100.00% 4342 out of 4342
    checks_failed......: 0.00%   0 out of 4342

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    gotenberg_html_latency.........: avg=138.16439 min=82.956  med=124.471  max=398.478  p(90)=171.748  p(95)=195.2275

    HTTP
    http_req_duration..............: avg=138.16ms  min=82.95ms med=124.47ms max=398.47ms p(90)=171.74ms p(95)=195.22ms
      { expected_response:true }...: avg=138.16ms  min=82.95ms med=124.47ms max=398.47ms p(90)=171.74ms p(95)=195.22ms
    http_req_failed................: 0.00%  0 out of 2171
    http_reqs......................: 2171   36.116925/s

    EXECUTION
    iteration_duration.............: avg=138.34ms  min=83.05ms med=124.67ms max=398.61ms p(90)=171.9ms  p(95)=195.32ms
    iterations.....................: 2171   36.116925/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 71 MB  1.2 MB/s
    data_sent......................: 7.7 MB 129 kB/s




running (1m00.1s), 0/5 VUs, 2171 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```







# Carbone HTML to PDF

**Version**: 5.8.0

## 1 thread


```sh
  █ THRESHOLDS

    carbone_html_latency
    ✓ 'p(95)<5000' p(95)=26.9221

    http_req_duration
    ✓ 'p(95)<5000' p(95)=26.92ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 26268   437.662034/s
    checks_succeeded...: 100.00% 26268 out of 26268
    checks_failed......: 0.00%   0 out of 26268

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_html_latency...........: avg=22.619171 min=6.944  med=21.9595 max=74.65   p(90)=25.277  p(95)=26.9221

    HTTP
    http_req_duration..............: avg=22.61ms   min=6.94ms med=21.95ms max=74.65ms p(90)=25.27ms p(95)=26.92ms
      { expected_response:true }...: avg=22.61ms   min=6.94ms med=21.95ms max=74.65ms p(90)=25.27ms p(95)=26.92ms
    http_req_failed................: 0.00%  0 out of 13134
    http_reqs......................: 13134  218.831017/s

    EXECUTION
    iteration_duration.............: avg=22.83ms   min=7.05ms med=22.16ms max=77.62ms p(90)=25.47ms p(95)=27.15ms
    iterations.....................: 13134  218.831017/s
    vus............................: 5      min=5          max=5
    vus_max........................: 5      min=5          max=5

    NETWORK
    data_received..................: 526 MB 8.8 MB/s
    data_sent......................: 57 MB  957 kB/s




running (1m00.0s), 0/5 VUs, 13134 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

```


## 4 thread

```sh

  █ THRESHOLDS

    carbone_html_latency
    ✓ 'p(95)<5000' p(95)=10.92

    http_req_duration
    ✓ 'p(95)<5000' p(95)=10.92ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 68160   1135.847872/s
    checks_succeeded...: 100.00% 68160 out of 68160
    checks_failed......: 0.00%   0 out of 68160

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_html_latency...........: avg=8.663338 min=6.418  med=8.316  max=218.624  p(90)=10.1732 p(95)=10.92

    HTTP
    http_req_duration..............: avg=8.66ms   min=6.41ms med=8.31ms max=218.62ms p(90)=10.17ms p(95)=10.92ms
      { expected_response:true }...: avg=8.66ms   min=6.41ms med=8.31ms max=218.62ms p(90)=10.17ms p(95)=10.92ms
    http_req_failed................: 0.00%  0 out of 34080
    http_reqs......................: 34080  567.923936/s

    EXECUTION
    iteration_duration.............: avg=8.79ms   min=6.53ms med=8.44ms max=218.78ms p(90)=10.31ms p(95)=11.06ms
    iterations.....................: 34080  567.923936/s
    vus............................: 5      min=5          max=5
    vus_max........................: 5      min=5          max=5

    NETWORK
    data_received..................: 1.4 GB 23 MB/s
    data_sent......................: 149 MB 2.5 MB/s




running (1m00.0s), 0/5 VUs, 34080 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

``` 