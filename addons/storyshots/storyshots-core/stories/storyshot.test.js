import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '../src';

// with react-test-renderer
initStoryshots({
  framework: 'react',
  integrityOptions: { cwd: __dirname },
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({}),
});
