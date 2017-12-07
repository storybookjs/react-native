import path from 'path';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import initStoryshots from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  renderer: mount,
  serializer: toJSON,
});
