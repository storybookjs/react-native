import initStoryshots, { imageSnapshot } from '@storybook/addon-storyshots';
import path from 'path';
import fs from 'fs';

// We do screenshots against the static build of the storybook.
// For this test to be meaningful, you must build the static version of the storybook *before* running this test suite.
const pathToStorybookStatic = path.join(__dirname, '..', 'storybook-static');

if (!fs.existsSync(pathToStorybookStatic)) {
  console.error(
    'You are running image snapshots without having the static build of storybook. Please run "yarn run build-storybook" before running tests.'
  );
} else {
  initStoryshots({
    suite: 'Image snapshots',
    framework: 'react',
    storyKindRegex: /withImageSnapshot$/,
    configPath: path.join(__dirname, '..', '.storybook'),
    test: imageSnapshot({
      storybookUrl: `file://${pathToStorybookStatic}`,
      getMatchOptions: () => ({
        failureThreshold: 0.01, // 1% threshold,
        failureThresholdType: 'percent',
      }),
    }),
  });
}
