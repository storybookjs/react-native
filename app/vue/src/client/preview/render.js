import { stripIndents } from 'common-tags';
import Vue from 'vue';
import { VALUES } from '.';

let root = null;

function renderRoot(component) {
  root = new Vue({
    el: '#root',
    data() {
      return { [VALUES]: component.options[VALUES] };
    },
    render(h) {
      return h('div', { attrs: { id: 'root' } }, [h(component)]);
    },
  });
}

export default function render({
  story,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  showException,
  forceRender,
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

  // at component creation || refresh by HMR
  if (!root || !forceRender) {
    if (root) root.$destroy();

    renderRoot(component);
  } else {
    root[VALUES] = component.options[VALUES];
  }
}
