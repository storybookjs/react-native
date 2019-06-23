/** @jsx m */

import m from 'mithril';
import { action, actions } from '@storybook/addon-actions';
import Button from '../Button';

export default {
  title: 'Addons|Actions',
};

export const story1 = () => ({
  view: () => <Button onclick={action('logo1')}>Click me to log the action</Button>,
});
story1.title = 'Action only';

export const story2 = () => ({
  view: () => (
    <Button {...actions('onclick', 'ondblclick')}>(Double) click me to log the action</Button>
  ),
});
story2.title = 'Multiple actions';

export const story3 = () => ({
  view: () => (
    <Button {...actions({ onclick: 'clicked', ondblclick: 'double clicked' })}>
      (Double) click me to log the action
    </Button>
  ),
});
story3.title = 'Multiple actions, object';

export const story4 = () => ({
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
});
story4.title = 'Action and method';
