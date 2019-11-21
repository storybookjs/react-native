import { linkTo } from '@storybook/addon-links';
import { document } from 'global';

import '../simple-button.html';

export default {
  title: 'Addon/Links',
};

export const WithCreateElement = () => {
  const el = document.createElement('simple-button');
  el.title = 'Go to welcome';
  el.handleClick = linkTo('Welcome');
  return el;
};

WithCreateElement.story = {
  name: 'With Create Element',
};
