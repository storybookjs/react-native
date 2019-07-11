/** @jsx h */

import { h } from 'preact';

import { linkTo } from '@storybook/addon-links';

import Button from '../Button';

export default {
  title: 'Addons|Links',
};

export const goToWelcome = () => (
  <Button onclick={linkTo('Welcome')}>This button links to Welcome</Button>
);

goToWelcome.story = {
  name: 'Go to welcome',
};
