/** @jsx h */

import { h } from 'preact';

import { action, actions } from '@storybook/addon-actions';
import Button from '../Button';

export default {
  title: 'Addons|Actions',
};

export const actionOnly = () => <Button onclick={action('log')}>Click me to log the action</Button>;

actionOnly.story = {
  name: 'Action only',
};

export const multipleActions = () => (
  <Button {...actions('onclick', 'ondblclick')}>(Double) click me to log the action</Button>
);

multipleActions.story = {
  name: 'Multiple actions',
};

export const multipleActionsObject = () => (
  <Button {...actions({ onclick: 'click', ondblclick: 'double-click' })}>
    (Double) click me to log the action
  </Button>
);

multipleActionsObject.story = {
  name: 'Multiple actions, object',
};

export const actionAndMethod = () => (
  <Button
    onclick={event => {
      event.preventDefault();
      action('method-log')(event.target);
    }}
  >
    Click me to log the action
  </Button>
);

actionAndMethod.story = {
  name: 'Action and method',
};
