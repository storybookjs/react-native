import { window, document } from 'global';
import dedent from 'ts-dedent';
import { RenderMainArgs, ElementArgs, OptionsArgs } from './types';

declare let Ember: any;

const rootEl = document.getElementById('root');

const config = window.require(`${window.STORYBOOK_NAME}/config/environment`);
const app = window.require(`${window.STORYBOOK_NAME}/app`).default.create({
  autoboot: false,
  rootElement: rootEl,
  ...config.APP,
});

let lastPromise = app.boot();
let hasRendered = false;

function render(options: OptionsArgs, el: ElementArgs) {
  const { template, context = {}, element } = options;

  if (hasRendered) {
    lastPromise = lastPromise.then((instance: any) => instance.destroy());
  }

  lastPromise = lastPromise
    .then(() => {
      const appInstancePrivate = app.buildInstance();
      return appInstancePrivate.boot().then(() => appInstancePrivate);
    })
    .then((instance: any) => {
      instance.register(
        'component:story-mode',
        Ember.Component.extend({
          layout: template || options,
          ...context,
        })
      );

      const component = instance.lookup('component:story-mode');

      if (element) {
        component.appendTo(element);

        element.appendTo(el);
      } else {
        component.appendTo(el);
      }
      hasRendered = true;

      return instance;
    });
}

export default function renderMain({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
}: RenderMainArgs) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Ember element from the story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
        Did you forget to return the Ember element from the story?
        Use "() => hbs('{{component}}')" or "() => { return {
          template: hbs\`{{component}}\`
        } }" when defining the story.
      `,
    });
    return;
  }

  showMain();
  render(element, rootEl);
}
