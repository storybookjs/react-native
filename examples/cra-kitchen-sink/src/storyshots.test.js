import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import emotionSerializer from '@emotion/snapshot-serializer';
import path from 'path';
import { render as renderer, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createSerializer } from 'enzyme-to-json';

configure({ adapter: new Adapter() });

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  integrityOptions: { cwd: path.join(__dirname, 'stories') },
  test: multiSnapshotWithOptions({
    renderer,
  }),
  snapshotSerializers: [createSerializer(), emotionSerializer],
});
