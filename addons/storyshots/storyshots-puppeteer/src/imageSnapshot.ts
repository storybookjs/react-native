import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { defaultImageSnapshotConfig, ImageSnapshotConfig } from './config';
import { puppeteerTest } from './puppeteerTest';

expect.extend({ toMatchImageSnapshot });

export const imageSnapshot = (customConfig: Partial<ImageSnapshotConfig> = {}) => {
  const config = { ...defaultImageSnapshotConfig, ...customConfig };
  const { getMatchOptions, getScreenshotOptions, beforeScreenshot, afterScreenshot } = config;

  return puppeteerTest({
    ...config,
    async testBody(page, options) {
      expect.assertions(1);
      await beforeScreenshot(page, options);
      const image = await page.screenshot(getScreenshotOptions(options));
      await afterScreenshot({ image, context: options.context });
      expect(image).toMatchImageSnapshot(getMatchOptions(options));
    },
  });
};
