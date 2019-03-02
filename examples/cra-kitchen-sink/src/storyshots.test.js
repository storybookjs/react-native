import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import path from 'path';
import { render as renderer, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer as enzymeSerializer } from 'enzyme-to-json';
import { createSerializer as emotionSerializer } from 'jest-emotion';

configure({ adapter: new Adapter() });

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  integrityOptions: { cwd: path.join(__dirname, 'stories') },
  test: multiSnapshotWithOptions({
    renderer,
  }),
  snapshotSerializers: [enzymeSerializer(), emotionSerializer()],
});
