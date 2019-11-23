import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const Story1 = () => <Welcome showApp={linkTo('Button')} />;
Story1.title = 'to Storybook';
