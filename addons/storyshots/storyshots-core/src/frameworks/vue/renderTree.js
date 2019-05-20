// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

function getRenderedTree(story) {
  const component = story.render();

  const vm = new Vue({
    render(h) {
      return h(component);
    },
  });

  return vm.$mount().$el;
}

export default getRenderedTree;
