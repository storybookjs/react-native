import path from 'path';
import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import { render as renderer } from 'enzyme';
import { createSerializer as enzymeSerializer } from 'enzyme-to-json';
import { createSerializer as emotionSerializer } from 'jest-emotion';

jest.mock('react-dom', () => ({
  createPortal: node => node,
}));

// HTML Snapshots
initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '../'),
  integrityOptions: { cwd: path.join(__dirname, '..', 'stories') },
  test: multiSnapshotWithOptions({
    renderer,
  }),
  snapshotSerializers: [enzymeSerializer(), emotionSerializer()],
});
