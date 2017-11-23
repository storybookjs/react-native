import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({}),
});
