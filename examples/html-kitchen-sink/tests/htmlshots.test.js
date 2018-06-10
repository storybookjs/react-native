import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'html',
  integrityOptions: { cwd: path.resolve(__dirname, '../stories') },
  configPath: path.resolve(__dirname, '../.storybook'),
  test: multiSnapshotWithOptions(),
});
