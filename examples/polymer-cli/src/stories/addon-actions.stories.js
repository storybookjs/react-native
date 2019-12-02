import { action } from '@storybook/addon-actions';
import { document } from 'global';

import '../simple-button.html';

export default {
  title: 'Addon/Actions',
};

export const ActionOnly = () => {
  const el = document.createElement('simple-button');
  el.addEventListener('click', action('log1'));
  return el;
};

ActionOnly.story = {
  name: 'Action only',
};

export const ActionAndMethod = () => {
  const el = document.createElement('simple-button');
  el.addEventListener('click', e => action('log2')(e.target));
  return el;
};

ActionAndMethod.story = {
  name: 'Action and method',
};
