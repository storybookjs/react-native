import { storiesOf } from '@storybook/polymer';
import { action } from '@storybook/addon-actions';
import { document } from 'global';

import '../simple-button.html';

storiesOf('Addon|Actions', module)
  .add('Action only', () => {
    const el = document.createElement('simple-button');
    el.addEventListener('click', action('log1'));
    return el;
  })
  .add('Action and method', () => {
    const el = document.createElement('simple-button');
    el.addEventListener('click', e => action('log2')(e.target));
    return el;
  });
