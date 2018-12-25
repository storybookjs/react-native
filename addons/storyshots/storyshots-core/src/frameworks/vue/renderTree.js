// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

function getRenderedTree(story, context) {
  const component = story.render(context);

  const vm = new Vue({
    render(h) {
      return h(component);
    },
  });

  return vm.$mount().$el;
}

export default getRenderedTree;
