import { document } from 'global';
import { stripIndents } from 'common-tags';

const target = document.getElementById('root');

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

  target.innerHTML = '';

  if (!Component) {
    showError({
      title: `Expecting a Svelte component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Svelte component from the story?
        Use "() => ({ Component: YourComponent, data: {} })"
        when defining the story.
      `,
    });

    return;
  }

  const component = new Component({target, data}); // eslint-disable-line

  if (on) {
    Object.keys(on).forEach(eventName => {
      component.on(eventName, on[eventName]);
    });
  }

  showMain();
}
