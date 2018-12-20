/** @jsx h */

import { h } from 'preact';

import { storiesOf } from '@storybook/preact';
import { linkTo } from '@storybook/addon-links';

import Button from '../Button';

storiesOf('Addons|Links', module).add('Go to welcome', () => (
  <Button onclick={linkTo('Welcome')}>This button links to Welcome</Button>
));
