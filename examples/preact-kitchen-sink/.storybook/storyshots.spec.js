import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import renderer from 'preact-render-to-json';

initStoryshots({
  test: multiSnapshotWithOptions({ renderer }),
});
