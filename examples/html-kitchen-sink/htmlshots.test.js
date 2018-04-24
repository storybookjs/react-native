import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'html',
  integrityOptions: { cwd: path.join(__dirname, 'stories') },
  configPath: path.join(__dirname, '.storybook'),
  test: multiSnapshotWithOptions({}),
});
