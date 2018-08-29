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
      story: () => result,
      selectedKind: context.kind,
      selectedStory: context.story,
    });
  }
}

function getRenderedTree(story, context) {
  const rootElement = bootstrapADocumentAndReturnANode();

  const result = story.render(context);

  makeSureThatResultIsRenderedSomehow({ context, result, rootElement });

  return rootElement;
}

export default getRenderedTree;
