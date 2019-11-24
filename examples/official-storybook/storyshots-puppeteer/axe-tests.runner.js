/* This file is not suffixed by ".test.js" to not being run with all other test files.
 * This test needs the static build of the storybook to run.
 * `yarn run storyshots-puppeteer` generates the static build & uses storyshots-puppeteer.
 * */
import path from 'path';
import fs from 'fs';
import initStoryshots from '@storybook/addon-storyshots';
import { axeTest } from '@storybook/addon-storyshots-puppeteer';
import { logger } from '@storybook/node-logger';

// We run puppeteer tests on the static build of the storybook.
// For this test to be meaningful, you must build the static version of the storybook *before* running this test suite.
const pathToStorybookStatic = path.join(__dirname, '../', 'storybook-static');

if (!fs.existsSync(pathToStorybookStatic)) {
  logger.error(
    'You are running puppeteer tests without having the static build of storybook. Please run "yarn run build-storybook" before running tests.'
  );
} else {
  initStoryshots({
    suite: 'Puppeteer tests',
    storyKindRegex: /^Basics|UI/,
    framework: 'react',
    configPath: path.join(__dirname, '..'),
    test: axeTest({
      storybookUrl: `file://${pathToStorybookStatic}`,
    }),
  });
}
