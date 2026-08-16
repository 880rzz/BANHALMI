module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node tools/perf-static-server.mjs _site 4175',
      startServerReadyPattern: 'PERF_SERVER_READY',
      startServerReadyTimeout: 10000,
      url: [
        'http://127.0.0.1:4175/',
        'http://127.0.0.1:4175/hu/',
        'http://127.0.0.1:4175/de-at/',
        'http://127.0.0.1:4175/requestaquote/',
        'http://127.0.0.1:4175/hu/ajanlatkeres/',
        'http://127.0.0.1:4175/de-at/anfrage/'
      ],
      numberOfRuns: 2,
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
          disabled: false
        },
        throttlingMethod: 'simulate',
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        // Raw LHCI floor is 0.98 so the three quote routes can legitimately pass
        // at 98. tools/audit-lighthouse-all-runs.mjs applies the stricter 0.99
        // floor to every non-quote URL on every individual Lighthouse report.
        'categories:performance': ['error', { minScore: 0.98 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }]
      }
    },
    upload: { target: 'filesystem', outputDir: './artifacts/lighthouse-mobile' }
  }
};
