import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

export default {
  title: 'Welcome',
  parameters: {
    component: Welcome,
  },
};

export const story1 = () => <Welcome showApp={linkTo('Button')} />;
story1.story = { name: 'to Storybook' };
