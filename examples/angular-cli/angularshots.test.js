import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'angular',
  integrityOptions: { cwd: path.join(__dirname, 'src', 'stories') },
  configPath: path.join(__dirname, '.storybook'),
  test: multiSnapshotWithOptions({}),
});
