import path from 'path';
import { mount } from 'enzyme';
import { createSerializer } from 'enzyme-to-json';
import initStoryshots from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  renderer: mount,
  snapshotSerializers: [createSerializer()],
});
