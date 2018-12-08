/* This file is not suffixed by ".test.js" to not being run with all other test files.
 * This test needs the static build of the storybook to run.
 * `yarn run image-snapshots` generates the static build & uses the image snapshots behavior of storyshots.
 * */
import path from 'path';
import fs from 'fs';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import { logger } from '@storybook/node-logger';

// Image snapshots
// We do screenshots against the static build of the storybook.
// For this test to be meaningful, you must build the static version of the storybook *before* running this test suite.
const pathToStorybookStatic = path.join(__dirname, '../', 'storybook-static');

if (!fs.existsSync(pathToStorybookStatic)) {
  logger.error(
    'You are running image snapshots without having the static build of storybook. Please run "yarn run build-storybook" before running tests.'
  );
} else {
  initStoryshots({
    suite: 'Image snapshots',
    storyKindRegex: /^Addons\|Storyshots/,
    framework: 'react',
    configPath: path.join(__dirname, '..'),
    test: imageSnapshot({
      storybookUrl: `file://${pathToStorybookStatic}`,
      getMatchOptions: () => ({
        failureThreshold: 0.02, // 2% threshold,
        failureThresholdType: 'percent',
      }),
    }),
  });
}
