import renderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';
import 'jest-specific-snapshot';
import { getStoryshotFile } from './utils';

function getRenderedTree(story, context, options) {
  const storyElement = story.render(context);
  return renderer.create(storyElement, options).toJSON();
}

function getSnapshotFileName(context) {
  const fileName = context.fileName;

  if (!fileName) {
    return null;
  }

  return getStoryshotFile(fileName);
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

export function shallowSnapshot({ story, context }) {
  const shallowRenderer = shallow.createRenderer();
  const result = shallowRenderer.render(story.render(context));
  expect(result).toMatchSnapshot();
}

export function renderOnly({ story, context }) {
  const storyElement = story.render(context);
  renderer.create(storyElement);
}
