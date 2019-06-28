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
story1.story = { name: 'Action only' };

export const story2 = () => ({
  view: () => (
    <Button {...actions('onclick', 'ondblclick')}>(Double) click me to log the action</Button>
  ),
});
story2.story = { name: 'Multiple actions' };

export const story3 = () => ({
  view: () => (
    <Button {...actions({ onclick: 'clicked', ondblclick: 'double clicked' })}>
      (Double) click me to log the action
    </Button>
  ),
});
story3.story = { name: 'Multiple actions, object' };

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
story4.story = { name: 'Action and method' };
