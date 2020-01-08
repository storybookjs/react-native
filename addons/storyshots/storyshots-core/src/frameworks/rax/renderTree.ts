// eslint-disable-next-line import/no-unresolved
import raxTestRenderer from 'rax-test-renderer';

function getRenderedTree(story: any, context: any, { renderer, ...rendererOptions }: any) {
  const storyElement = story.render();
  const currentRenderer = renderer || raxTestRenderer.create;
  const tree = currentRenderer(storyElement, rendererOptions);

  return tree;
}

export default getRenderedTree;
