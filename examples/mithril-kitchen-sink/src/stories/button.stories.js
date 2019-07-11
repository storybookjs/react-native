import m from 'mithril';

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from '../Button';

export default {
  title: 'Button',
  parameters: {
    component: Button,
  },
};

export const story1 = () => ({
  view: () => m(Button, { onclick: action('clicked') }, 'Hello Button'),
});
story1.story = { name: 'with text' };

export const story2 = () => ({
  view: () =>
    m(
      Button,
      { onclick: action('clicked') },
      m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
    ),
});
story2.story = { name: 'with some emoji' };
