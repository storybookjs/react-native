import { action, actions } from '@storybook/addon-actions';

export default {
  title: 'Addon|Actions',
};

export const actionOnly = () => ({
  template: '<my-button :handle-click="log">Click me to log the action</my-button>',
  methods: {
    log: action('log1'),
  },
});

actionOnly.story = {
  name: 'Action only',
};

export const multipleActions = () => ({
  template:
    '<my-button :handle-click="click" :handle-dblclick="doubleclick">(Double) click me to log the action</my-button>',
  methods: actions('click', 'doubleclick'),
});

multipleActions.story = {
  name: 'Multiple actions',
};

export const multipleActionsObject = () => ({
  template:
    '<my-button :handle-click="click" :handle-dblclick="doubleclick">(Double) click me to log the action</my-button>',
  methods: actions({ click: 'clicked', doubleclick: 'double clicked' }),
});

multipleActionsObject.story = {
  name: 'Multiple actions, object',
};

export const actionAndMethod = () => ({
  template: '<my-button :handle-click="log">Click me to log the action</my-button>',
  methods: {
    log: e => {
      e.preventDefault();
      action('log2')(e.target);
    },
  },
});

actionAndMethod.story = {
  name: 'Action and method',
};
