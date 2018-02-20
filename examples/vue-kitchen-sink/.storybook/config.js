import { configure } from '@storybook/vue';
import { setOptions } from '@storybook/addon-options';
import Vue from 'vue';
import Vuex from 'vuex';

import MyButton from '../src/stories/Button.vue';

Vue.component('my-button', MyButton);
Vue.use(Vuex);

setOptions({
  hierarchyRootSeparator: /\|/,
});

function loadStories() {
  require('../src/stories');

  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
