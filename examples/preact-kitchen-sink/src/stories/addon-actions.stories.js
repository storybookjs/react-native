/** @jsx h */

import { h } from 'preact';

import { action, actions } from '@storybook/addon-actions';
import Button from '../Button';

export default {
  title: 'Addons/Actions',
};

export const ActionOnly = () => <Button onclick={action('log')}>Click me to log the action</Button>;

ActionOnly.story = {
  name: 'Action only',
};

export const MultipleActions = () => (
  <Button {...actions('onclick', 'ondblclick')}>(Double) click me to log the action</Button>
);

MultipleActions.story = {
  name: 'Multiple actions',
};

export const MultipleActionsObject = () => (
  <Button {...actions({ onclick: 'click', ondblclick: 'double-click' })}>
    (Double) click me to log the action
  </Button>
);

MultipleActionsObject.story = {
  name: 'Multiple actions, object',
};

export const ActionAndMethod = () => (
  <Button
    onclick={event => {
      event.preventDefault();
      action('method-log')(event.target);
    }}
  >
    Click me to log the action
  </Button>
);

ActionAndMethod.story = {
  name: 'Action and method',
};
