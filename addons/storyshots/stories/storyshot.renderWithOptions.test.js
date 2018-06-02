import path from 'path';
import initStoryshots, { renderWithOptions } from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: renderWithOptions({}),
});
