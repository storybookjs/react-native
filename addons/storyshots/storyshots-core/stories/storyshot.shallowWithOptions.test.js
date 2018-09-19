import path from 'path';
import initStoryshots, { shallowSnapshot } from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: data =>
    shallowSnapshot({
      ...data,
    }),
});
