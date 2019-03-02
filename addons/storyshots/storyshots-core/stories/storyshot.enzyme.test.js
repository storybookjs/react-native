import path from 'path';
import { mount } from 'enzyme';
import { createSerializer as enzymeSerializer } from 'enzyme-to-json';
import { createSerializer as emotionSerializer } from 'jest-emotion';
import initStoryshots from '../src';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  renderer: mount,
  snapshotSerializers: [enzymeSerializer(), emotionSerializer()],
});
