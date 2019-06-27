import { linkTo } from '@storybook/addon-links';
import { document } from 'global';

import '../simple-button.html';

export default {
  title: 'Addon|Links',
};

export const withCreateElement = () => {
  const el = document.createElement('simple-button');
  el.title = 'Go to welcome';
  el.handleClick = linkTo('Welcome');
  return el;
};

withCreateElement.story = {
  name: 'With Create Element',
};
