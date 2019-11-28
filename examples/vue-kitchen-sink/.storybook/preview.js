import { addParameters, addDecorator } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';
import { withA11y } from '@storybook/addon-a11y';

import MyButton from '../src/stories/Button.vue';

addDecorator(withA11y);
Vue.component('my-button', MyButton);
Vue.use(Vuex);

addParameters({
  docs: {
    inlineStories: true,
    iframeHeight: '60px',
  },
});
