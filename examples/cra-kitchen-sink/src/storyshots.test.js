import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import path from 'path';

import { render as renderer, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import serializer from 'enzyme-to-json';

configure({ adapter: new Adapter() });

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({
    renderer,
    serializer,
  }),
});
