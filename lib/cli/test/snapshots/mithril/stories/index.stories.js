import m from 'mithril';

import { storiesOf } from '@storybook/mithril';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Button from './Button';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => ({
  view: () => m(Welcome, { showApp: linkTo('Button') }),
}));

storiesOf('Button', module)
  .add('with text', () => ({
    view: () => m(Button, { onclick: action('clicked') }, 'Hello Button'),
  }))
  .add('with some emoji', () => ({
    view: () =>
      m(
        Button,
        { onclick: action('clicked') },
        m('span', { role: 'img', ariaLabel: 'so cool' }, '😀 😎 👍 💯')
      ),
  }));
