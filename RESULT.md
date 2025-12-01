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
    ✓ 'p(95)<5000' p(95)=81.80225

    http_req_duration
    ✓ 'p(95)<5000' p(95)=81.8ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 8240    137.17985/s
    checks_succeeded...: 100.00% 8240 out of 8240
    checks_failed......: 0.00%   0 out of 8240

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    collabora_latency..............: avg=72.344921 min=62.598  med=70.7315 max=269.463  p(90)=78.2613 p(95)=81.80225

    HTTP
    http_req_duration..............: avg=72.34ms   min=62.59ms med=70.73ms max=269.46ms p(90)=78.26ms p(95)=81.8ms
      { expected_response:true }...: avg=72.34ms   min=62.59ms med=70.73ms max=269.46ms p(90)=78.26ms p(95)=81.8ms
    http_req_failed................: 0.00%  0 out of 4120
    http_reqs......................: 4120   68.589925/s

    EXECUTION
    iteration_duration.............: avg=72.82ms   min=63.36ms med=71.19ms max=269.87ms p(90)=78.81ms p(95)=82.24ms
    iterations.....................: 4120   68.589925/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 199 MB 3.3 MB/s
    data_sent......................: 137 MB 2.3 MB/s




running (1m00.1s), 0/5 VUs, 4120 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

``` 


## 4 thread

```sh

  █ THRESHOLDS

    collabora_latency
    ✓ 'p(95)<5000' p(95)=79.2571

    http_req_duration
    ✓ 'p(95)<5000' p(95)=79.25ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 8420    140.249252/s
    checks_succeeded...: 100.00% 8420 out of 8420
    checks_failed......: 0.00%   0 out of 8420

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    collabora_latency..............: avg=70.784259 min=60.673  med=69.236  max=164.95   p(90)=75.8134 p(95)=79.2571

    HTTP
    http_req_duration..............: avg=70.78ms   min=60.67ms med=69.23ms max=164.95ms p(90)=75.81ms p(95)=79.25ms
      { expected_response:true }...: avg=70.78ms   min=60.67ms med=69.23ms max=164.95ms p(90)=75.81ms p(95)=79.25ms
    http_req_failed................: 0.00%  0 out of 4210
    http_reqs......................: 4210   70.124626/s

    EXECUTION
    iteration_duration.............: avg=71.27ms   min=61.27ms med=69.71ms max=166.1ms  p(90)=76.26ms p(95)=79.96ms
    iterations.....................: 4210   70.124626/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 203 MB 3.4 MB/s
    data_sent......................: 140 MB 2.3 MB/s




running (1m00.0s), 0/5 VUs, 4210 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```



# Carbone

## 1 thread

```sh

  █ THRESHOLDS

    carbone_latency
    ✓ 'p(95)<5000' p(95)=51.0232

    http_req_duration
    ✓ 'p(95)<5000' p(95)=51.02ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 13078   217.829478/s
    checks_succeeded...: 100.00% 13078 out of 13078
    checks_failed......: 0.00%   0 out of 13078

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_latency................: avg=45.703475 min=28.867  med=43.528  max=1279.099 p(90)=48.0014 p(95)=51.0232

    HTTP
    http_req_duration..............: avg=45.7ms    min=28.86ms med=43.52ms max=1.27s    p(90)=48ms    p(95)=51.02ms
      { expected_response:true }...: avg=45.7ms    min=28.86ms med=43.52ms max=1.27s    p(90)=48ms    p(95)=51.02ms
    http_req_failed................: 0.00%  0 out of 6539
    http_reqs......................: 6539   108.914739/s

    EXECUTION
    iteration_duration.............: avg=45.87ms   min=28.97ms med=43.7ms  max=1.27s    p(90)=48.2ms  p(95)=51.15ms
    iterations.....................: 6539   108.914739/s
    vus............................: 5      min=5         max=5
    vus_max........................: 5      min=5         max=5

    NETWORK
    data_received..................: 120 MB 2.0 MB/s
    data_sent......................: 2.0 MB 33 kB/s




running (1m00.0s), 0/5 VUs, 6539 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
``` 


## 4 thread


```sh
  █ THRESHOLDS

    carbone_latency
    ✓ 'p(95)<5000' p(95)=21.0499

    http_req_duration
    ✓ 'p(95)<5000' p(95)=21.04ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 36784   612.941116/s
    checks_succeeded...: 100.00% 36784 out of 36784
    checks_failed......: 0.00%   0 out of 36784

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_latency................: avg=16.155913 min=11.287  med=15.054  max=781.137  p(90)=19.0479 p(95)=21.0499

    HTTP
    http_req_duration..............: avg=16.15ms   min=11.28ms med=15.05ms max=781.13ms p(90)=19.04ms p(95)=21.04ms
      { expected_response:true }...: avg=16.15ms   min=11.28ms med=15.05ms max=781.13ms p(90)=19.04ms p(95)=21.04ms
    http_req_failed................: 0.00%  0 out of 18392
    http_reqs......................: 18392  306.470558/s

    EXECUTION
    iteration_duration.............: avg=16.3ms    min=11.37ms med=15.19ms max=781.25ms p(90)=19.21ms p(95)=21.19ms
    iterations.....................: 18392  306.470558/s
    vus............................: 5      min=5          max=5
    vus_max........................: 5      min=5          max=5

    NETWORK
    data_received..................: 339 MB 5.6 MB/s
    data_sent......................: 5.5 MB 92 kB/s




running (1m00.0s), 0/5 VUs, 18392 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```


# Gotenberg Chrome

## 1 thread

```sh
  █ THRESHOLDS

    gotenberg_html_latency
    ✓ 'p(95)<5000' p(95)=523.4358

    http_req_duration
    ✓ 'p(95)<5000' p(95)=523.43ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 1390    23.047907/s
    checks_succeeded...: 100.00% 1390 out of 1390
    checks_failed......: 0.00%   0 out of 1390

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    gotenberg_html_latency.........: avg=432.609001 min=95.932  med=467.734  max=638.283  p(90)=506.6344 p(95)=523.4358

    HTTP
    http_req_duration..............: avg=432.6ms    min=95.93ms med=467.73ms max=638.28ms p(90)=506.63ms p(95)=523.43ms
      { expected_response:true }...: avg=432.6ms    min=95.93ms med=467.73ms max=638.28ms p(90)=506.63ms p(95)=523.43ms
    http_req_failed................: 0.00%  0 out of 695
    http_reqs......................: 695    11.523953/s

    EXECUTION
    iteration_duration.............: avg=432.82ms   min=97.12ms med=467.95ms max=638.64ms p(90)=506.81ms p(95)=523.76ms
    iterations.....................: 695    11.523953/s
    vus............................: 5      min=5        max=5
    vus_max........................: 5      min=5        max=5

    NETWORK
    data_received..................: 34 MB  570 kB/s
    data_sent......................: 2.5 MB 41 kB/s




running (1m00.3s), 0/5 VUs, 695 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s
```

## 4 thread

Not possible.



```


# Carbone HTML to PDF

## 1 thread


```sh

  █ THRESHOLDS

    carbone_html_latency
    ✓ 'p(95)<5000' p(95)=28.49485

    http_req_duration
    ✓ 'p(95)<5000' p(95)=28.49ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 23908   398.33067/s
    checks_succeeded...: 100.00% 23908 out of 23908
    checks_failed......: 0.00%   0 out of 23908

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_html_latency...........: avg=24.885517 min=19.617  med=24.326  max=107.471  p(90)=26.7032 p(95)=28.49485

    HTTP
    http_req_duration..............: avg=24.88ms   min=19.61ms med=24.32ms max=107.47ms p(90)=26.7ms  p(95)=28.49ms
      { expected_response:true }...: avg=24.88ms   min=19.61ms med=24.32ms max=107.47ms p(90)=26.7ms  p(95)=28.49ms
    http_req_failed................: 0.00%  0 out of 11954
    http_reqs......................: 11954  199.165335/s

    EXECUTION
    iteration_duration.............: avg=25.09ms   min=19.74ms med=24.52ms max=107.71ms p(90)=26.88ms p(95)=28.7ms
    iterations.....................: 11954  199.165335/s
    vus............................: 5      min=5          max=5
    vus_max........................: 5      min=5          max=5

    NETWORK
    data_received..................: 543 MB 9.0 MB/s
    data_sent......................: 52 MB  871 kB/s




running (1m00.0s), 0/5 VUs, 11954 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

```


## 4 thread

```sh

 █ THRESHOLDS

    carbone_html_latency
    ✓ 'p(95)<5000' p(95)=12.0402

    http_req_duration
    ✓ 'p(95)<5000' p(95)=12.04ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 63560   1059.239149/s
    checks_succeeded...: 100.00% 63560 out of 63560
    checks_failed......: 0.00%   0 out of 63560

    ✓ status is 200
    ✓ duration < 10s

    CUSTOM
    carbone_html_latency...........: avg=9.272673 min=6.693  med=8.74   max=150.377  p(90)=11.078  p(95)=12.0402

    HTTP
    http_req_duration..............: avg=9.27ms   min=6.69ms med=8.74ms max=150.37ms p(90)=11.07ms p(95)=12.04ms
      { expected_response:true }...: avg=9.27ms   min=6.69ms med=8.74ms max=150.37ms p(90)=11.07ms p(95)=12.04ms
    http_req_failed................: 0.00%  0 out of 31780
    http_reqs......................: 31780  529.619575/s

    EXECUTION
    iteration_duration.............: avg=9.43ms   min=6.81ms med=8.89ms max=150.6ms  p(90)=11.22ms p(95)=12.22ms
    iterations.....................: 31780  529.619575/s
    vus............................: 5      min=5          max=5
    vus_max........................: 5      min=5          max=5

    NETWORK
    data_received..................: 1.4 GB 24 MB/s
    data_sent......................: 139 MB 2.3 MB/s




running (1m00.0s), 0/5 VUs, 31780 complete and 0 interrupted iterations
default ✓ [======================================] 5 VUs  1m0s

``` 