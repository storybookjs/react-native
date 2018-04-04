import { storiesOf } from '@storybook/vue';
import { action, actions } from '@storybook/addon-actions';

storiesOf('Addon|Actions', module)
  .add('Action only', () => ({
    template: '<my-button :handle-click="log">Click me to log the action</my-button>',
    methods: {
      log: action('log1'),
    },
  }))
  .add('Multiple actions', () => ({
    template:
      '<my-button :handle-click="click" :handle-dblclick="doubleclick">(Double) click me to log the action</my-button>',
    methods: actions('click', 'doubleclick'),
  }))
  .add('Multiple actions, object', () => ({
    template:
      '<my-button :handle-click="click" :handle-dblclick="doubleclick">(Double) click me to log the action</my-button>',
    methods: actions({ click: 'clicked', doubleclick: 'double clicked' }),
  }))
  .add('Action and method', () => ({
    template: '<my-button :handle-click="log">Click me to log the action</my-button>',
    methods: {
      log: e => {
        e.preventDefault();
        action('log2')(e.target);
      },
    },
  }));
