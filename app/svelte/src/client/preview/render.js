import { document } from 'global';
import { stripIndents } from 'common-tags';

let listeners = [];

/**
 * Since we may have added events using `.on()` we need to ensure that these
 * events are cleaned up when changing between stories.
 *
 * @see mountView()
 */
function cancelPreviousStoryListeners() {
  listeners.forEach(listener => listener.cancel());

  listeners = [];
}

function mountView({ Component, target, data, on, Wrapper, WrapperData }) {
  let component;

  if (Wrapper) {
    const fragment = document.createDocumentFragment();
    component = new Component({ target: fragment, data });

    const wrapper = new Wrapper({
      target,
      slots: { default: fragment },
      data: WrapperData || {},
    });
    component.on('destroy', () => {
      wrapper.destroy(true);
    });
  } else {
    component = new Component({ target, data });
  }

  if (on) {
    // Attach svelte event listeners.
    listeners = Object.keys(on).map(eventName => {
      const listener = component.on(eventName, on[eventName]);

      // We need this so we can call `cancel()` on it when the next story is rendered.
      return listener;
    });
  }
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
    Wrapper,
    WrapperData,
  } = story();

  const target = document.getElementById('root');

  target.innerHTML = '';

  cancelPreviousStoryListeners();

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

  mountView({ Component, target, data, on, Wrapper, WrapperData });

  showMain();
}
