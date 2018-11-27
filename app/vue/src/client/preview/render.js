import { stripIndents } from 'common-tags';
import Vue from 'vue';

let root = null;

function getComponentProxy(component) {
  return Object.entries(component.props || {})
    .map(([name, def]) => ({ [name]: def.default }))
    .reduce((wrap, prop) => ({ ...wrap, ...prop }), {});
}

function renderRoot(component, proxy) {
  root = new Vue({
    el: '#root',
    beforeCreate() {
      this.proxy = proxy;
    },

    render(h) {
      const props = this.proxy;
      return h('div', { attrs: { id: 'root' } }, [h(component, { props })]);
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

  const proxy = getComponentProxy(component);

  // at component creation || refresh by HMR
  if (!root || !forceRender) {
    if (root) root.$destroy();

    renderRoot(component, proxy);
  } else {
    root.proxy = proxy;
    root.$forceUpdate();
  }
}
