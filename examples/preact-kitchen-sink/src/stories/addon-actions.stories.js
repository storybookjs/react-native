/** @jsx h */

import { h } from 'preact';

import { storiesOf } from '@storybook/preact';
import { action, actions } from '@storybook/addon-actions';
import Button from '../Button';

storiesOf('Addons|Actions', module)
  .add('Action only', () => <Button onclick={action('log')}>Click me to log the action</Button>)
  .add('Multiple actions', () => (
    <Button {...actions('onclick', 'ondblclick')}>(Double) click me to log the action</Button>
  ))
  .add('Multiple actions, object', () => (
    <Button {...actions({ onclick: 'click', ondblclick: 'double-click' })}>
      (Double) click me to log the action
    </Button>
  ))
  .add('Action and method', () => (
    <Button
      onclick={event => {
        event.preventDefault();
        action('method-log')(event.target);
      }}
    >
      Click me to log the action
    </Button>
  ));
