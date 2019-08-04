import 'jest-specific-snapshot';

const isFunction = (obj: any) => !!(obj && obj.constructor && obj.call && obj.apply);
const optionsOrCallOptions = (opts: any, story: any) => (isFunction(opts) ? opts(story) : opts);

export const snapshotWithOptions = (options: { renderer?: any; serializer?: any } = {}) => ({
  story,
  context,
  renderTree,
  snapshotFileName,
}: any) => {
  const result = renderTree(story, context, optionsOrCallOptions(options, story));

  function match(tree: any) {
    if (snapshotFileName) {
      // @ts-ignore
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

export const multiSnapshotWithOptions = (options = {}) => ({
  story,
  context,
  renderTree,
  stories2snapsConverter,
}: any) =>
  snapshotWithOptions(options)({
    story,
    context,
    renderTree,
    snapshotFileName: stories2snapsConverter.getSnapshotFileName(context),
  });

export function shallowSnapshot({ story, context, renderShallowTree, options = {} }: any) {
  const result = renderShallowTree(story, context, options);
  expect(result).toMatchSnapshot();
}

export const renderWithOptions = (options = {}) => ({ story, context, renderTree }: any) => {
  const result = renderTree(story, context, options);

  if (typeof result.then === 'function') {
    return result;
  }

  return undefined;
};

export const renderOnly = renderWithOptions();

export const snapshot = snapshotWithOptions();
