// eslint-disable-next-line import/no-extraneous-dependencies
import reactTestRenderer from 'react-test-renderer';

function getRenderedTree(story, context, { renderer, serializer, ...rendererOptions }) {
  const storyElement = story.render(context);
  const currentRenderer = renderer || reactTestRenderer.create;
  const tree = currentRenderer(storyElement, rendererOptions);
  return serializer ? serializer(tree) : tree;
}

export default getRenderedTree;
