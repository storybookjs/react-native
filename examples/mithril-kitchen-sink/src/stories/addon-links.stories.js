/** @jsx m */

import m from 'mithril';

import { linkTo } from '@storybook/addon-links';
import Button from '../Button';

export default {
  title: 'Addons|Links',
};

export const story1 = () => ({
  view: () => <Button onclick={linkTo('Welcome')}>This buttons links to Welcome</Button>,
});
story1.story = { name: 'Go to welcome' };
