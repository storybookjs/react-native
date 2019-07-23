/** @jsx h */
import { h } from 'preact';
import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <Welcome showApp={linkTo('Button')} />;

toStorybook.story = {
  name: 'to Storybook',
};
