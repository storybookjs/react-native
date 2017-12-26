import 'jest-specific-snapshot';
import { getSnapshotFileName } from './utils';

export const snapshotWithOptions = options => ({
  story,
  context,
  renderTree,
  snapshotFileName,
}) => {
  const tree = renderTree(story, context, options);

  if (snapshotFileName) {
    expect(tree).toMatchSpecificSnapshot(snapshotFileName);
  } else {
    expect(tree).toMatchSnapshot();
  }

  if (typeof tree.unmount === 'function') {
    tree.unmount();
  }
};

export const multiSnapshotWithOptions = options => ({ story, context, renderTree }) => {
  snapshotWithOptions(options)({
    story,
    context,
    renderTree,
    snapshotFileName: getSnapshotFileName(context),
  });
};

export const snapshot = snapshotWithOptions({});
