import { stripIndents } from 'common-tags';
import Vue from 'vue';

let root = null;

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

  const props = Object.entries(component.props)
    .map(([name, def]) => ({ [name]: def.default }))
    .reduce((wrapper, prop) => ({ ...wrapper, ...prop }), {});

  if (!root) {
    root = new Vue({
      el: '#root',
      render(h) {
        return h('div', { attrs: { id: 'root' } }, [h(component, { props: this.proxy || null })]);
      },
    });
  } else if (forceRender) {
    root.proxy = props;
    root.$forceUpdate();
  }
}
