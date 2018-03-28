/** @jsx m */

import m from 'mithril';

import { storiesOf } from '@storybook/mithril';
import { linkTo } from '@storybook/addon-links';
import Button from '../Button';

storiesOf('Addons|Links', module).add('Go to welcome', () => ({
  view: () => <Button onclick={linkTo('Welcome')}>This buttons links to Welcome</Button>,
}));
