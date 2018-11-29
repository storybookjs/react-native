import path from 'path';
import emotionSerializer from '@emotion/snapshot-serializer';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import { render as renderer } from 'enzyme';
import { createSerializer } from 'enzyme-to-json';

// HTML Snapshots
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '../'),
  integrityOptions: { cwd: path.join(__dirname, '..', 'stories') },
  test: multiSnapshotWithOptions({
    renderer,
  }),
  snapshotSerializers: [createSerializer(), emotionSerializer],
});
