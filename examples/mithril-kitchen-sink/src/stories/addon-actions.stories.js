/** @jsx m */

import m from 'mithril';

import { storiesOf } from '@storybook/mithril';
import { action, actions } from '@storybook/addon-actions';
import Button from '../Button';

storiesOf('Addons|Actions', module)
  .add('Action only', () => ({
    view: () => <Button onclick={action('logo1')}>Click me to log the action</Button>,
  }))
  .add('Multiple actions', () => ({
    view: () => (
      <Button {...actions('onclick', 'ondblclick')}>(Double) click me to log the action</Button>
    ),
  }))
  .add('Multiple actions, object', () => ({
    view: () => (
      <Button {...actions({ onclick: 'clicked', ondblclick: 'double clicked' })}>
        (Double) click me to log the action
      </Button>
    ),
  }))

  .add('Action and method', () => ({
    view: () => (
      <Button
        onclick={e => {
          e.preventDefault();
          action('log2')(e.target);
        }}
      >
        Click me to log the action
      </Button>
    ),
  }));
