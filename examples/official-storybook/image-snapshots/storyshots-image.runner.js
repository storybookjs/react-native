/* This file is not suffixed by ".test.js" to not being run with all other test files.
* This test needs the static build of the storybook to run.
* `yarn run image-snapshots` generates the static build & uses the image snapshots behavior of storyshots.
* */
import path from 'path';
import fs from 'fs';
import initStoryshots, { imageSnapshot } from '@storybook/addon-storyshots';
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
      beforeScreenshot: (page, { context }) => {
        // Screenshots for this story have to be tweaked.
        if (context.kind === 'ui/Layout') {
          // Some weird stuff are done inside Layout component, so we have to wait some to get a viable screenshot.
          // Tried some values here, seems 200 is long enough, not too short either :)
          // Not sure why this is required but seems better than to avoid taking screenshots for these.
          return new Promise(resolve => setTimeout(resolve, 200));
        }
        return Promise.resolve();
      },
    }),
  });
}
