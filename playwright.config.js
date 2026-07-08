// playwright.config.js
// Playwright configuration for B Maluleka Attorneys Inc QA suite.
//
// Run all tests:        npx playwright test
// Run a single file:    npx playwright test tests/contact.spec.js
// Show HTML report:     npx playwright show-report

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Run tests in parallel for speed
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI (flakiness buffer)
  retries: process.env.CI ? 1 : 0,

  // Limit parallel workers on CI to avoid resource contention
  workers: process.env.CI ? 2 : undefined,

  // HTML reporter — open automatically after a local run
  reporter: [['html', { open: 'on-failure' }]],

  use: {
    // TODO: Replace with the actual deployed URL once the site is hosted.
    // For local file-based testing, use a local server (e.g. `npx serve .`)
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Collect traces on first retry — essential for debugging CI failures
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on retry
    video: 'on-first-retry',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports (TC-UI-10)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
