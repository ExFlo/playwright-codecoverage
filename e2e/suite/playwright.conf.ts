import { PlaywrightTestConfig } from '@playwright/test';

// export const baseUrl = 'http://localhost:4200';
// export const browserName = process.env.PW_BROWSER || 'chromium';

// export const browserConfig: LaunchOptions = {
//   headless: process.env.PW_HEADLESS === 'true'
// };

// if (process.env.PW_SLOW_MOTION === 'true') {
//   browserConfig.slowMo = 1000;
// }

// if (browserName === 'chromium') {
//   browserConfig.chromiumSandbox = false;
// }

export const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    // recordVideo: process.env.NGB_VIDEO ? { dir: 'test-videos' } : undefined
  }
};

export default config;
