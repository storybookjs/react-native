import { stripIndents } from 'common-tags';
import Vue from 'vue';

let root = null;

function updateComponent(component) {
  const [lastStory] = root.$children;

  if (!lastStory) {
    return false;
  }

  if (typeof component.data !== 'function') {
    return false;
  }

  const data = component.data();

  if (!data) {
    return false;
  }

  Object.entries(data).forEach(([key, value]) => {
    lastStory[key] = value;
  });

  lastStory.$forceUpdate();

  return true;
}

function renderRoot({ forceRender, component }) {
  if (root) {
    if (forceRender === true && updateComponent(component)) {
      return;
    }

    root.$destroy();
  }

  root = new Vue({
    el: '#root',
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

  renderRoot({ forceRender, component });
}
