import reactTestRenderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';
import 'jest-specific-snapshot';
import { getSnapshotFileName } from './utils';

function getRenderedTree(story, context, { renderer, serializer, ...rendererOptions }) {
  const currentRenderer = renderer || reactTestRenderer.create;
  const storyElement = story.render(context);
  const tree = currentRenderer(storyElement, rendererOptions);
  return serializer ? serializer(tree) : tree;
}

export const snapshotWithOptions = options => ({ story, context }) => {
  const tree = getRenderedTree(story, context, options);
  expect(tree).toMatchSnapshot();
};

export const multiSnapshotWithOptions = options => ({ story, context }) => {
  const tree = getRenderedTree(story, context, options);
  const snapshotFileName = getSnapshotFileName(context);

  if (!snapshotFileName) {
    expect(tree).toMatchSnapshot();
    return;
  }

  expect(tree).toMatchSpecificSnapshot(snapshotFileName);
};

export const snapshot = snapshotWithOptions({});

export function shallowSnapshot({ story, context, options: { renderer, serializer } }) {
  const shallowRenderer = renderer || shallow.createRenderer();
  const tree = shallowRenderer.render(story.render(context));
  const serializedTree = serializer ? serializer(tree) : tree;
  expect(serializedTree).toMatchSnapshot();
}

export function renderOnly({ story, context }) {
  const storyElement = story.render(context);
  reactTestRenderer.create(storyElement);
}
