import puppeteer from 'puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { logger } from '@storybook/node-logger';

expect.extend({ toMatchImageSnapshot });

// We consider taking the full page is a reasonnable default.
const defaultScreenshotOptions = () => ({ fullPage: true });

const noop = () => {};

const defaultConfig = {
  storybookUrl: 'http://localhost:6006',
  getMatchOptions: noop,
  getScreenshotOptions: defaultScreenshotOptions,
  beforeScreenshot: noop,
  getGotoOptions: noop,
};

export const imageSnapshot = (customConfig = {}) => {
  const {
    storybookUrl,
    getMatchOptions,
    getScreenshotOptions,
    beforeScreenshot,
    getGotoOptions,
  } = { ...defaultConfig, ...customConfig };
  let browser; // holds ref to browser. (ie. Chrome)
  let page; // Hold ref to the page to screenshot.

  const testFn = ({ context }) => {
    if (context.framework === 'rn') {
      // Skip tests since we de not support RN image snapshots.
      logger.error(
        "It seems you are running imageSnapshot on RN app and it's not supported. Skipping test."
      );
      return Promise.resolve();
    }

    const encodedKind = encodeURIComponent(context.kind);
    const encodedStoryName = encodeURIComponent(context.story);
    const storyUrl = `/iframe.html?selectedKind=${encodedKind}&selectedStory=${encodedStoryName}`;
    const url = storybookUrl + storyUrl;
    if (!browser || !page) {
      logger.error(
        `Error when generating image snapshot for test ${context.kind} - ${
          context.story
        } : It seems the headless browser is not running.`
      );
      return Promise.reject(new Error('no-headless-browser-running'));
    }

    expect.assertions(1);
    return page
      .goto(url, getGotoOptions({ context, url }))
      .catch(e => {
        logger.error(
          `ERROR WHILE CONNECTING TO ${url}, did you start or build the storybook first ? A storybook instance should be running or a static version should be built when using image snapshot feature.`,
          e
        );
        throw e;
      })
      .then(() => beforeScreenshot(page, { context, url }))
      .then(() => page.screenshot(getScreenshotOptions({ context, url })))
      .then(image => {
        expect(image).toMatchImageSnapshot(getMatchOptions({ context, url }));
      });
  };

  testFn.beforeAll = () =>
    puppeteer
      // add some options "no-sandbox" to make it work properly on some Linux systems as proposed here: https://github.com/Googlechrome/puppeteer/issues/290#issuecomment-322851507
      .launch({ args: ['--no-sandbox ', '--disable-setuid-sandbox'] })
      .then(b => {
        browser = b;
      })
      .then(() => browser.newPage())
      .then(p => {
        page = p;
      });

  testFn.afterAll = () => browser.close();

  return testFn;
};
