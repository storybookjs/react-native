import React from 'react';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Addons/Links/Button',
};

export const First = () => (
  <button type="button" onClick={linkTo('Addons/Links/Button', 'Second')}>
    Go to "Second"
  </button>
);

export const Second = () => (
  <button type="button" onClick={linkTo('Addons/Links/Button', 'First')}>
    Go to "First"
  </button>
);
