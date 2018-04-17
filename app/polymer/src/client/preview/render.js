import { document } from 'global';
import { stripIndents } from 'common-tags';
import { html, render, TemplateResult } from 'lit-html';
import { logger } from '@storybook/client-logger';
import { nopreview } from './nopreview';
import { errorpreview } from './errorpreview';

let previousKind = '';
let previousStory = '';

const rootElement = document.getElementById('root');

export function renderError(error) {
  rootElement.innerHTML = errorpreview(error.message, error.stack);
}

export function renderException(error) {
  renderError(error);
  logger.error(error.stack);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return;
  const { selectedKind, selectedStory } = data;
  const story = storyStore.getStoryWithContext(selectedKind, selectedStory);

  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    previousKind = selectedKind;
    previousStory = selectedStory;
  } else {
    return;
  }
  const component = story ? story() : nopreview;

  if (!component) {
    renderError({
      message: `Expecting a Polymer component from the story: "${selectedStory}" of "${selectedKind}".`,
      stack: stripIndents`
        Did you forget to return the Polymer component from the story?
        Use "() => '&lt;your-component-name&gt;&lt;/your-component-name\&gt;'" when defining the story.
      `,
    });
    return;
  }
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

export default function renderPreview({ reduxStore, storyStore }) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderException(state.error);
  }
  try {
    return renderMain(state, storyStore);
  } catch (ex) {
    return renderException(ex);
  }
}
