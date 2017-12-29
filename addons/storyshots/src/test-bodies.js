import 'jest-specific-snapshot';
import { getSnapshotFileName } from './utils';

export const snapshotWithOptions = options => ({
  story,
  context,
  renderTree,
  snapshotFileName,
}) => {
  const result = renderTree(story, context, options);

  function match(tree) {
    if (snapshotFileName) {
      expect(tree).toMatchSpecificSnapshot(snapshotFileName);
    } else {
      expect(tree).toMatchSnapshot();
    }

    if (typeof tree.unmount === 'function') {
      tree.unmount();
    }
  }

  if (typeof result.then === 'function') {
    return result.then(match);
  }

  return match(result);
};

export const multiSnapshotWithOptions = options => ({ story, context, renderTree }) =>
  snapshotWithOptions(options)({
    story,
    context,
    renderTree,
    snapshotFileName: getSnapshotFileName(context),
  });

export const snapshot = snapshotWithOptions({});
