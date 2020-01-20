import { Browser, Page } from 'puppeteer';
import { logger } from '@storybook/node-logger';
import { constructUrl } from './url';
import { defaultPuppeteerTestConfig, PuppeteerTestConfig } from './config';

export const puppeteerTest = (customConfig: Partial<PuppeteerTestConfig> = {}) => {
  const {
    storybookUrl,
    chromeExecutablePath,
    getGotoOptions,
    customizePage,
    getCustomBrowser,
    testBody,
    setupTimeout,
    testTimeout,
  } = { ...defaultPuppeteerTestConfig, ...customConfig };

  let browser: Browser; // holds ref to browser. (ie. Chrome)
  let page: Page; // Hold ref to the page to screenshot.

  const testFn = async ({ context }: any) => {
    const { kind, framework, name, id } = context;
    if (framework === 'react-native') {
      // Skip tests since RN is not a browser environment.
      logger.error(
        "It seems you are running puppeteer test on RN app and it's not supported. Skipping test."
      );

      return;
    }

    const url = constructUrl(storybookUrl, id);
    const options = { context, url };
    if (testBody.filter != null && !testBody.filter(options)) {
      return;
    }

    if (!browser || !page) {
      logger.error(
        `Error when running puppeteer test for ${kind} - ${name} : It seems the headless browser is not running.`
      );

      throw new Error('no-headless-browser-running');
    }

    try {
      await customizePage(page);
      await page.goto(url, getGotoOptions(options));
    } catch (e) {
      logger.error(
        `Error when connecting to ${url}, did you start or build the storybook first? A storybook instance should be running or a static version should be built when using puppeteer test feature.`
      );
      throw e;
    }
    await testBody(page, options);
  };
  testFn.timeout = testTimeout;

  const cleanup = async () => {
    if (getCustomBrowser && page) {
      await page.close();
    } else if (browser) {
      await browser.close();
    }
  };

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit();
  });
  testFn.afterAll = cleanup;

  const beforeAll = async () => {
    if (getCustomBrowser) {
      browser = await getCustomBrowser();
    } else {
      // eslint-disable-next-line global-require
      const puppeteer = require('puppeteer');
      // add some options "no-sandbox" to make it work properly on some Linux systems as proposed here: https://github.com/Googlechrome/puppeteer/issues/290#issuecomment-322851507
      browser = await puppeteer.launch({
        args: ['--no-sandbox ', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        executablePath: chromeExecutablePath,
      });
    }

    page = await browser.newPage();
  };
  beforeAll.timeout = setupTimeout;
  testFn.beforeAll = beforeAll;

  return testFn;
};
