import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import { render as renderer } from 'enzyme';
import serializer from 'enzyme-to-json';

// HTML Snapshots
initStoryshots({
  framework: 'react',
  configPath: __dirname,
  test: multiSnapshotWithOptions({
    renderer,
    serializer,
  }),
});
