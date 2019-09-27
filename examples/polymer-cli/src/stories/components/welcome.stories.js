import { linkTo } from '@storybook/addon-links';
import { document } from 'global';

import '../storybook-welcome-to-polymer.html';

export default {
  title: 'Welcome',
};

export const Welcome = () => {
  const el = document.createElement('storybook-welcome-to-polymer');
  el.goToButton = linkTo('Button');
  return el;
};
