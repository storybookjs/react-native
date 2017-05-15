import renderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';

export function snapshot({ story, context }) {
  const storyElement = story.render(context);
  const tree = renderer.create(storyElement).toJSON();
  expect(tree).toMatchSnapshot();
}

export function renderOnly({ story, context }) {
  const storyElement = story.render(context);
  const tree = renderer.create(storyElement);
}
