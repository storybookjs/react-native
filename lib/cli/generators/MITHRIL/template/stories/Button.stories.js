import m from 'mithril';
import { action } from '@storybook/addon-actions';
import Button from './Button';

export default {
  title: 'Button',
};

export const text = () => ({
  view: () => m(Button, { onclick: action('clicked') }, 'Hello Button'),
});

export const emoji = () => ({
  view: () =>
    m(
      Button,
      { onclick: action('clicked') },
      m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
    ),
});
