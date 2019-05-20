import { document } from 'global';
import { stripIndents } from 'common-tags';

let previousComponent = null;

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }

  previousComponent.$destroy();
  previousComponent = null;
}

function mountView({ Component, target, props, on, Wrapper, WrapperData }) {
  let component;

  if (Wrapper) {
    const fragment = document.createDocumentFragment();
    component = new Component({ target: fragment, props });

    const wrapper = new Wrapper({
      target,
      slots: { default: fragment },
      props: WrapperData || {},
    });
    component.$on('destroy', () => {
      wrapper.$destroy(true);
    });
  } else {
    component = new Component({ target, props });
  }

  if (on) {
    // Attach svelte event listeners.
    Object.keys(on).forEach(eventName => {
      component.$on(eventName, on[eventName]);
    });
  }

  previousComponent = component;
}

export default function render({
  storyFn,
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
    props,
    /** @type {{[string]: () => {}}} Attach svelte event handlers */
    on,
    Wrapper,
    WrapperData,
  } = storyFn();

  cleanUpPreviousStory();
  const DefaultCompatComponent = Component ? Component.default || Component : undefined;
  const DefaultCompatWrapper = Wrapper ? Wrapper.default || Wrapper : undefined;

  if (!DefaultCompatComponent) {
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

  mountView({
    Component: DefaultCompatComponent,
    target,
    props,
    on,
    Wrapper: DefaultCompatWrapper,
    WrapperData,
  });

  showMain();
}
