import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import path from 'path';

import { render as renderer } from 'enzyme';
import serializer from 'enzyme-to-json';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({
    renderer,
    serializer,
  }),
});
