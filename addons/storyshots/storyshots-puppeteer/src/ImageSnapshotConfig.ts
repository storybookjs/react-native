import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { Base64ScreenShotOptions, Browser, DirectNavigationOptions, Page } from 'puppeteer-core';

export interface Context {
  kind: string;
  story: string;
}

export interface ImageSnapshotConfig {
  storybookUrl: string;
  chromeExecutablePath: string;
  getMatchOptions: (options: { context: Context; url: string }) => MatchImageSnapshotOptions;
  getScreenshotOptions: (options: { context: Context; url: string }) => Base64ScreenShotOptions;
  beforeScreenshot: (page: Page, options: { context: Context; url: string }) => void;
  getGotoOptions: (options: { context: Context; url: string }) => DirectNavigationOptions;
  customizePage: (page: Page) => Promise<void>;
  getCustomBrowser: () => Promise<Browser>;
}
