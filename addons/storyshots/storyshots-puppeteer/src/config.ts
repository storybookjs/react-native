import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { Base64ScreenShotOptions, Browser, DirectNavigationOptions, Page } from 'puppeteer';

export interface Context {
  kind: string;
  story: string;
  parameters: {
    [key: string]: any;
  };
}

export interface CommonConfig {
  storybookUrl: string;
  chromeExecutablePath: string;
  getGotoOptions: (options: { context: Context; url: string }) => DirectNavigationOptions;
  customizePage: (page: Page) => Promise<void>;
  getCustomBrowser: () => Promise<Browser>;
  setupTimeout: number;
  testTimeout: number;
}

export interface PuppeteerTestConfig extends CommonConfig {
  testBody: (page: Page, options: { context: Context; url: string }) => void | Promise<void>;
}

export interface ImageSnapshotConfig extends CommonConfig {
  getMatchOptions: (options: { context: Context; url: string }) => MatchImageSnapshotOptions;
  getScreenshotOptions: (options: { context: Context; url: string }) => Base64ScreenShotOptions;
  beforeScreenshot: (page: Page, options: { context: Context; url: string }) => void;
}

const noop: () => undefined = () => undefined;
const asyncNoop: () => Promise<undefined> = async () => undefined;

export const defaultCommonConfig: CommonConfig = {
  storybookUrl: 'http://localhost:6006',
  chromeExecutablePath: undefined,
  getGotoOptions: noop,
  customizePage: asyncNoop,
  getCustomBrowser: undefined,
  setupTimeout: 15000,
  testTimeout: 15000,
};

export const defaultPuppeteerTestConfig: PuppeteerTestConfig = {
  ...defaultCommonConfig,
  testBody(page, options) {
    const testBody = options.context.parameters.puppeteerTest;
    if (testBody != null) {
      return testBody(page, options);
    }
    return null;
  },
};

// We consider taking the full page is a reasonable default.
const defaultScreenshotOptions = () => ({ fullPage: true, encoding: 'base64' } as const);
export const defaultImageSnapshotConfig: ImageSnapshotConfig = {
  ...defaultCommonConfig,
  getMatchOptions: noop,
  getScreenshotOptions: defaultScreenshotOptions,
  beforeScreenshot: noop,
};
