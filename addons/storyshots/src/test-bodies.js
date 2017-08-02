import path from 'path';
import renderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';
import 'jest-specific-snapshot';

export const snapshotWithOptions = options => ({ story, context }) => {
  const storyElement = story.render(context);
  const tree = renderer.create(storyElement, options).toJSON();

  const fileName = context.storyFileName || __filename;
  const { dir, name } = path.parse(fileName);
  const snapshotFileName = path.format({ dir, name, ext: '.storyshot' });

  expect(tree).toMatchSpecificSnapshot(snapshotFileName);
  // expect(tree).toMatchSnapshot();
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
