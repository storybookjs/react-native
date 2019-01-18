/** @jsx h */

// eslint-disable-next-line import/no-extraneous-dependencies
import preactRenderer from 'preact-render-to-json';

function getRenderedTree(story, context, { renderer, ...rendererOptions }) {
  const storyElement = story.render();
  const currentRenderer = renderer || preactRenderer;
  const tree = currentRenderer(storyElement, rendererOptions);

  return tree;
}

export default getRenderedTree;
