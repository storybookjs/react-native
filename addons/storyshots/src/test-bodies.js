import renderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';

export const snapshotWithOptions = options => ({ story, context }) => {
  const storyElement = story.render(context);
  const tree = renderer.create(storyElement, options).toJSON();
  expect(tree).toMatchSnapshot();
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
