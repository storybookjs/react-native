import { stripIndents } from 'common-tags';
import Vue from 'vue';

let app = null;

function renderRoot(options) {
  if (app) app.$destroy();

  app = new Vue(options);
}

export default function render({
  story,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  showException,
}) {
  Vue.config.errorHandler = showException;

  const component = story();

  if (!component) {
    showError({
      title: `Expecting a Vue component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();
  renderRoot({
    el: '#root',
    render(h) {
      return h('div', { attrs: { id: 'root' } }, [h(component)]);
    },
  });
}
