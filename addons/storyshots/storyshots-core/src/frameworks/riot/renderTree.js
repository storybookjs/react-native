import { document } from 'global';

const riotForStorybook = require.requireActual('@storybook/riot');

function bootstrapADocumentAndReturnANode() {
  const rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body = document.createElement('body');
  document.body.appendChild(rootElement);
  return rootElement;
}

function makeSureThatResultIsRenderedSomehow({ context, result, rootElement }) {
  if (!rootElement.firstChild) {
    riotForStorybook.render({
      storyFn: () => result,
      selectedKind: context.kind,
      selectedStory: context.name,
    });
  }
}

function getRenderedTree(story, context) {
  const rootElement = bootstrapADocumentAndReturnANode();

  const result = story.render();

  makeSureThatResultIsRenderedSomehow({ context, result, rootElement });

  return rootElement;
}

export default getRenderedTree;
