import { document } from 'global';
import { stripIndents } from 'common-tags';

const rootEl = document.getElementById('root');
let activeComponent = null; // currently loaded marko component.
let activeTemplate = null; // template for the currently loaded component.

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  parameters,
  // forceRender,
}) {
  const config = storyFn();

  if (!config || !(config.appendTo || config.component || parameters.component)) {
    showError({
      title: `Expecting an object with a component property to be returned from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the component from the story?
        Use "() => ({ component: MyComponent, input: { hello: 'world' } })" when defining the story.
      `,
    });

    return;
  }
  if (config.appendTo) {
    console.warn(
      '@storybook/marko: returning a rendered component for a story is deprecated, return an object with `{ component, input }` instead.'
    );

    // The deprecated API always destroys the previous component instance.
    if (activeComponent) {
      activeComponent.destroy();
    }

    activeComponent = config.appendTo(rootEl).getComponent();
  } else {
    const template = config.component || parameters.component;

    if (activeTemplate === template) {
      // When rendering the same template with new input, we reuse the same instance.
      activeComponent.input = config.input;
      activeComponent.update();
    } else {
      if (activeComponent) {
        activeComponent.destroy();
      }

      activeTemplate = template;
      activeComponent = activeTemplate
        .renderSync(config.input)
        .appendTo(rootEl)
        .getComponent();
    }
  }

  showMain();
}
