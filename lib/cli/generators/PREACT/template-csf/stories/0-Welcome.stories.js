/** @jsx h */
import { h } from 'preact';
import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => <Welcome showApp={linkTo('Button')} />;

ToStorybook.story = {
  name: 'to Storybook',
};
