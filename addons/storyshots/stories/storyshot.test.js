import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '../src';

// with react-test-renderer
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({}),
});
