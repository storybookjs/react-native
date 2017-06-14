import Vue from 'vue';
import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';
import MyButton from './Button.vue';

// This does not work. We need to Vue.use or Vue.component is called before mount the root Vue
// Vue.use(Vuex);
// Vue.component('my-button', MyButton);

storiesOf('Button')
  // Works if Vue.component is called in the config.js in .storybook 
  .add('rounded markup only', '<my-button :rounded="true">not rounded</my-button>')
  .add('story as a function template', () => '<my-button :rounded="true">not rounded</my-button>')
  .add('story as a function renderer', () => (h) => h('div', ['Hello renderer']))
  .add('story as a function component with template', () => ({
    template: '<my-button :rounded="true">not rounded</my-button>',
  }))
  .add('story as a function component with renderer', () => ({
    render: (h) => h('my-button', { props : { rounded: true }}),
  }))
  .add('with vuex', {
    components: { MyButton },
    template: '<my-button :handle-click="log">{{ $store.state.count }}</my-button>',
    store: new Vuex.Store({
      state: { count: 0 },
      mutations: {
        increment(state) {
          state.count++;
        }
      }
    }),
    methods: {
      log() {
        this.$store.commit('increment');
      },
    },
  })
  .add('with text', {
    // need to register local component until we can make sur Vue.componennt si called before mounting the root Vue
    components: { MyButton },
    template: '<my-button :handle-click="log">{{ count }}</my-button>',
    data: () => ({
      count: 10,
    }),
    methods: {
      log() {
        this.count++;
      }
    }
  })
  .add('with emoji', '<div>😑😐😶🙄</div>')
  .add('with emoji 2', '<div>🤔😳😯😮</div>')
  .add('colorful', {
    render(h) {
      return h(MyButton, { props: { color: 'pink' } }, ['hello world']);
    }
  })
  .add('rounded', {
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  })
  .add('not rounded', {
    components: { MyButton },
    template: '<my-button :rounded="false">not rounded</my-button>'
  })
