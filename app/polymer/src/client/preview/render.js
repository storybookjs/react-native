import { document } from 'global';
import { stripIndents } from 'common-tags';
import { html, render, TemplateResult } from 'lit-html';

const rootElement = document.getElementById('root');

export default function renderMain({ story, selectedKind, selectedStory, showMain, showError }) {
  const component = story();

  if (!component) {
    showError({
      message: `Expecting a Polymer component from the story: "${selectedStory}" of "${selectedKind}".`,
      stack: stripIndents`
        Did you forget to return the Polymer component from the story?
        Use "() => '&lt;your-component-name&gt;&lt;/your-component-name\&gt;'" when defining the story.
      `,
    });
    return;
  }

  showMain();
  if (typeof component === 'string') {
    rootElement.innerHTML = component;
  } else if (component instanceof TemplateResult) {
    // `render` stores the TemplateInstance in the Node and tries to update based on that.
    // Since we reuse `rootElement` for all stories, remove the stored instance first.
    render(html``, rootElement);
    render(component, rootElement);
  } else {
    rootElement.innerHTML = '';
    rootElement.appendChild(component);
  }
}
