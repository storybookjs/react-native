import m from 'mithril';
import { action } from '@storybook/addon-actions';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const Text = () => ({
  view: () => m(Button, { onclick: action('clicked') }, 'Hello Button'),
});

export const Emoji = () => ({
  view: () =>
    m(
      Button,
      { onclick: action('clicked') },
      m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
    ),
});
