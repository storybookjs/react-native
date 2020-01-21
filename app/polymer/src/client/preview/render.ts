import { document } from 'global';
import dedent from 'ts-dedent';
import { render, TemplateResult } from 'lit-html';
import { RenderMainArgs } from './types';

const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  forceRender,
}: RenderMainArgs) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Polymer component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
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
    if (!forceRender || !rootElement.querySelector('[id="root-inner"]')) {
      rootElement.innerHTML = '<div id="root-inner"></div>';
    }
    const renderTo = rootElement.querySelector('[id="root-inner"]');

    render(element, renderTo);
  } else {
    rootElement.innerHTML = '';
    rootElement.appendChild(element);
  }
}
