import { action } from '@storybook/addon-actions';
import { document } from 'global';

import '../simple-button.html';

export default {
  title: 'Addon|Actions',
};

export const actionOnly = () => {
  const el = document.createElement('simple-button');
  el.addEventListener('click', action('log1'));
  return el;
};

actionOnly.story = {
  name: 'Action only',
};

export const actionAndMethod = () => {
  const el = document.createElement('simple-button');
  el.addEventListener('click', e => action('log2')(e.target));
  return el;
};

actionAndMethod.story = {
  name: 'Action and method',
};
