// eslint-disable-next-line import/no-extraneous-dependencies
import shallow from 'react-test-renderer/shallow';

function getRenderedTree(story, context, { renderer, serializer }) {
  const storyElement = story.render(context);
  const shallowRenderer = renderer || shallow.createRenderer();
  const tree = shallowRenderer.render(storyElement);
  return serializer ? serializer(tree) : tree;
}

export default getRenderedTree;
