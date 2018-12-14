/** @jsx h */

// eslint-disable-next-line import/no-extraneous-dependencies
import preactRenderer from 'preact-render-to-json';

function getRenderedTree(story, context, { renderer, serializer, ...rendererOptions }) {
  const storyElement = story.render(context);
  const currentRenderer = renderer || preactRenderer;
  const tree = currentRenderer(storyElement, rendererOptions);

  if (serializer) {
    // eslint-disable-next-line no-console
    console.warn(
      'The "serializer" option of @storybook/addon-storyshots  has been deprecated. Please use "snapshotSerializers: [<your serializer>]" in the future.'
    );
    return serializer(tree);
  }
  return tree;
}

export default getRenderedTree;
