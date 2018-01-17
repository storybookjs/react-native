import path from 'path';
import initStoryshots, { renderOnly } from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: renderOnly,
});
