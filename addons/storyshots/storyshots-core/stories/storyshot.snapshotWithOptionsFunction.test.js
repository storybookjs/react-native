import path from 'path';
import initStoryshots, { snapshotWithOptions } from '../dist';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: snapshotWithOptions(() => ({})),
});
