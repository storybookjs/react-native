import { document, Node } from 'global';
import { stripIndents } from 'common-tags';

const rootElement = document.getElementById('root');

export default function renderMain({ story, selectedKind, selectedStory, showMain, showError }) {
  const component = story();

  showMain();
  if (typeof component === 'string') {
    rootElement.innerHTML = component;
  } else if (component instanceof Node) {
    rootElement.innerHTML = '';
    rootElement.appendChild(component);
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM node from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}
