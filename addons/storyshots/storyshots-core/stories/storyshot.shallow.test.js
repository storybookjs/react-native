import path from 'path';
import initStoryshots, { shallowSnapshot } from '../dist';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: shallowSnapshot,
});
