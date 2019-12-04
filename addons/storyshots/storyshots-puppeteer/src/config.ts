import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { Base64ScreenShotOptions, Browser, DirectNavigationOptions, Page } from 'puppeteer';

export interface Context {
  kind: string;
  story: string;
  parameters: {
    [key: string]: any;
  };
}

interface Options {
  context: Context;
  url: string;
}

export interface CommonConfig {
  storybookUrl: string;
  chromeExecutablePath: string;
  getGotoOptions: (options: Options) => DirectNavigationOptions;
  customizePage: (page: Page) => Promise<void>;
  getCustomBrowser: () => Promise<Browser>;
  setupTimeout: number;
  testTimeout: number;
}

export interface PuppeteerTestConfig extends CommonConfig {
  testBody: ((page: Page, options: Options) => void | Promise<void>) & {
    filter?: (options: Options) => boolean;
  };
}

export interface ImageSnapshotConfig extends CommonConfig {
  getMatchOptions: (options: Options) => MatchImageSnapshotOptions;
  getScreenshotOptions: (options: Options) => Base64ScreenShotOptions;
  beforeScreenshot: (page: Page, options: Options) => void;
  afterScreenshot: (options: { image: string; context: Context }) => void;
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

const getTestBody = (options: Options) => options.context.parameters.puppeteerTest;

function defaultTestBody(page: Page, options: Options) {
  const testBody = getTestBody(options);
  if (testBody != null) {
    return testBody(page, options);
  }
  return null;
}

defaultTestBody.filter = (options: Options) => getTestBody(options) != null;

export const defaultPuppeteerTestConfig: PuppeteerTestConfig = {
  ...defaultCommonConfig,
  testBody: defaultTestBody,
};

// We consider taking the full page is a reasonable default.
const defaultScreenshotOptions = () => ({ fullPage: true, encoding: 'base64' } as const);
export const defaultImageSnapshotConfig: ImageSnapshotConfig = {
  ...defaultCommonConfig,
  getMatchOptions: noop,
  getScreenshotOptions: defaultScreenshotOptions,
  beforeScreenshot: noop,
  afterScreenshot: noop,
};
