import reactTestRenderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';

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
