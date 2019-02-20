import { document } from 'global';
import { stripIndents } from 'common-tags';
import { html, render, TemplateResult } from 'lit-html';

const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  forceRender,
}) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Polymer component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Polymer component from the story?
        Use "() => '&lt;your-component-name&gt;&lt;/your-component-name\&gt;'" when defining the story.
      `,
    });
    return;
  }

  showMain();
  if (typeof element === 'string') {
    rootElement.innerHTML = element;
  } else if (element instanceof TemplateResult) {
    // `render` stores the TemplateInstance in the Node and tries to update based on that.
    // Since we reuse `rootElement` for all stories, remove the stored instance first.
    // But forceRender means that it's the same story, so we want too keep the state in that case.
    if (!forceRender) {
      render(html``, rootElement);
    }
    render(element, rootElement);
  } else {
    rootElement.innerHTML = '';
    rootElement.appendChild(element);
  }
}
