import { stripIndents } from 'common-tags';
import Vue from 'vue';

export const COMPONENT = 'STORYBOOK_COMPONENT';
export const VALUES = 'STORYBOOK_VALUES';

const root = new Vue({
  data() {
    return {
      [COMPONENT]: undefined,
      [VALUES]: {},
    };
  },
  render(h) {
    const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
    return h('div', { attrs: { id: 'root' } }, children);
  },
});

export default function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  showException,
  forceRender,
}) {
  Vue.config.errorHandler = showException;

  const element = storyFn();

  if (!element) {
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
  if (!root[COMPONENT] || !forceRender) {
    root[COMPONENT] = element;
  }

  root[VALUES] = element.options[VALUES];

  if (!root.$el) {
    root.$mount('#root');
  }
}
