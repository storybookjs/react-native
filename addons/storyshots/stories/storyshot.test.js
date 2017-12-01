import path from 'path';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import initStoryshots, { multiSnapshotWithOptions } from '../src';

// with react-test-renderer
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({}),
});

// with enzyme
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  renderer: mount,
  serializer: toJSON,
});
