import { defineConfig, devices } from '@playwright/test';
import { register } from 'tsconfig-paths';
import { resolve } from 'path';

register({
  baseUrl: resolve(__dirname),
  paths: { '@automation/*': ['automation/src/*'] },
});

const baseURL = process.env.BASE_URL ?? 'http://localhost:3000';
const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === 'true';

export default defineConfig({
  testDir: 'automation/src/test/automated-testcases',
  // Single mock-server process shares in-memory state — use CI shards, not workers > 1.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['allure-playwright', { detail: true, suiteTitle: false }],
  ],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.02,
    },
  },
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
  },
  projects: [{ name: 'chromium' }],
  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: 'npm run server',
          url: `${baseURL}/health`,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
