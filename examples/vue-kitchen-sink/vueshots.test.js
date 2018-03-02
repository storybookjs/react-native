import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'vue',
  configPath: path.join(__dirname, '.storybook'),
  test: multiSnapshotWithOptions({}),
});
