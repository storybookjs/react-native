import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Welcome',

  parameters: {
    component: Welcome,
  },
};

export const story1 = () => <Welcome showApp={linkTo('Button')} />;
story1.title = 'to Storybook';
