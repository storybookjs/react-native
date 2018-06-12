import path from 'path';
import initStoryshots, { multiSnapshotWithOptions, Stories2SnapsConverter } from '../src';

initStoryshots({
  framework: 'react',
  integrityOptions: { cwd: __dirname },
  stories2snapsConverter: new Stories2SnapsConverter({ snapshotExtension: '.foo' }),
  configPath: path.join(__dirname, '..', '.storybook', 'configTest.js'),
  test: multiSnapshotWithOptions(),
});
