import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: process.env.CI ? [['github'], ['line']] : [['list']],
  webServer: {
    command: 'python3 -m http.server 4174 --directory _site',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 120000
  },
  use: {
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    trace: 'retain-on-failure'
  }
});
