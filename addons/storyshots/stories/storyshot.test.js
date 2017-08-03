import initStoryshots, { multiSnapshotWithOptions } from '../src';

initStoryshots({
  test: multiSnapshotWithOptions({}),
});
