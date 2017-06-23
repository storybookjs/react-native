import Vuex from 'vuex';
import { storiesOf } from '@storybook/vue';

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { addonNotes } from '@storybook/addon-notes';

import { addonKnobs, text, number, boolean, array, select } from '@storybook/addon-knobs';

import MyButton from './Button.vue';
import Welcome from './Welcome.vue';
import App from '../App.vue';

storiesOf('Welcome', module).add('Welcome', () => ({
  render: h => h(Welcome),
}));

storiesOf('App', module).add('App', () => ({
  render: h => h(App),
}));

storiesOf('Button', module)
  // Works if Vue.component is called in the config.js in .storybook
  .add('story as a function template', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">story as a function template</my-button>',
  }))
  .add('story as a function renderer', () => ({
    render: h => h('div', ['story as a function renderer']),
  }))
  .add('story as a function component with template', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">story as a function component with template</my-button>',
  }))
  .add('story as a function component with renderer', () => ({
    components: { MyButton },
    render: h =>
      h('my-button', { props: { rounded: true } }, ['story as a function component with renderer']),
  }))
  .add('with vuex', () => ({
    components: { MyButton },
    template: '<my-button :handle-click="log">with vuex: {{ $store.state.count }}</my-button>',
    store: new Vuex.Store({
      state: { count: 0 },
      mutations: {
        increment(state) {
          state.count += 1; // eslint-disable-line
          action();
        },
      },
    }),
    methods: {
      log() {
        this.$store.commit('increment');
      },
    },
  }))
  .add(
    'with knobs',
    addonKnobs()(() => {
      const name = text('Name', 'Storyteller');
      const age = number('Age', 70, { range: true, min: 0, max: 90, step: 5 });
      const fruits = {
        apple: 'Apple',
        banana: 'Banana',
        cherry: 'Cherry',
      };
      const fruit = select('Fruit', fruits, 'apple');
      const dollars = number('Dollars', 12.5);

      // NOTE: color picker is currently broken
      const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
      const nice = boolean('Nice', true);

      const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}.`;
      const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';

      return {
        components: { MyButton },
        template: `
        <div>
          <p>${intro}</p>     
          <p>My wallet contains: ${dollars.toFixed(2)}</p>
          <p>In my backpack, I have:</p>
          <ul>
            ${items.map(item => `<li key=${item}>${item}</li>`)}
          </ul>
          <p>${salutation}</p>
        </div>
      `,
      };
    })
  )
  .add('with text', () => ({
    // need to register local component until we can make sur Vue.componennt si called before mounting the root Vue
    components: { MyButton },
    template: '<my-button :handle-click="log">with text: {{ count }}</my-button>',
    data: () => ({
      count: 10,
    }),
    methods: {
      action: action('I love vue'),
      log() {
        this.count += 1;
        this.action(this.count);
      },
    },
  }));

storiesOf('Other', module)
  .add('button with emoji', () => ({
    template: '<button>😑😐😶🙄</button>',
  }))
  .add('p with emoji', () => ({
    template: '<p>🤔😳😯😮</p>',
  }))
  .add('colorful', () => ({
    render(h) {
      return h(MyButton, { props: { color: 'pink' } }, ['colorful']);
    },
  }))
  .add('rounded', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>',
  }))
  .add('not rounded', () => ({
    components: { MyButton },
    template: '<my-button :rounded="false" :handle-click="action">not rounded</my-button>',
    methods: {
      action: linkTo('Button'),
    },
  }));

storiesOf('Addon Notes', module)
  .add(
    'with some emoji',
    addonNotes({ notes: 'My notes on emojies' })(() => ({
      template: '<p>🤔😳😯😮</p>',
    }))
  )
  .add(
    'with some button',
    addonNotes({ notes: 'My notes on some button' })(() => ({
      components: { MyButton },
      template: '<my-button :rounded="true">rounded</my-button>',
    }))
  )
  .add(
    'with some color',
    addonNotes({ notes: 'Some notes on some colored component' })(() => ({
      render(h) {
        return h(MyButton, { props: { color: 'pink' } }, ['colorful']);
      },
    }))
  )
  .add(
    'with some text',
    addonNotes({ notes: 'My notes on some text' })(() => ({
      template: '<div>Text</div>',
    }))
  )
  .add(
    'with some long text',
    addonNotes({ notes: 'My notes on some long text' })(() => ({
      template: '<div>A looooooooonnnnnnnggggggggggggg text</div>',
    }))
  )
  .add(
    'with some bold text',
    addonNotes({ notes: 'My notes on some bold text' })(() => ({
      render: h => h('div', [h('strong', ['A very long text to display'])]),
    }))
  );

storiesOf('Addon Knobs', module)
  .add(
    'With some name',
    addonKnobs()(() => {
      const name = text('Name', 'Arunoda Susiripala');
      const age = number('Age', 89);

      const content = `I am ${name} and I'm ${age} years old.`;
      return {
        template: `<div>${content}</div>`,
      };
    })
  )
  .add(
    'With some different name',
    addonKnobs()(() => {
      const name = text('Name', 'Story Teller');
      const age = number('Age', 120);

      const content = `I am a ${name} and I'm ${age} years old.`;
      return {
        template: `<div>${content}</div>`,
      };
    })
  );
