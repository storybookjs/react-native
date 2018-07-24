import { document } from 'global';
import { stripIndents } from 'common-tags';

let previousComponent = null;

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }

  previousComponent.destroy();
  previousComponent = null;
}

function mountView({ Component, target, data, on }) {
  const component = new Component({ target, data });

  if (on) {
    // Attach svelte event listeners.
    Object.keys(on).forEach(eventName => {
      component.on(eventName, on[eventName]);
    });
  }

  previousComponent = component;
}

export default function render({
  story,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  // showException,
}) {
  const {
    /** @type {SvelteComponent} */
    Component,
    /** @type {any} */
    data,
    /** @type {{[string]: () => {}}} Attach svelte event handlers */
    on,
  } = story();

  cleanUpPreviousStory();

  if (!Component) {
    showError({
      title: `Expecting a Svelte component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Svelte component configuration from the story?
        Use "() => ({ Component: YourComponent, data: {} })"
        when defining the story.
      `,
    });

    return;
  }

  const target = document.getElementById('root');

  target.innerHTML = '';

  mountView({ Component, target, data, on });

  showMain();
}
