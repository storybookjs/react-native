import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

export default {
  title: 'Other/Demo/Welcome',
  component: Welcome,
};

// Some other valid values:
// - 'other-demo-buttonmdx--with-text'
// - 'Other/Demo/ButtonMdx'
export const ToStorybook = () => <Welcome showApp={linkTo('Other/Demo/Button')} />;
ToStorybook.story = {
  name: 'to Storybook',
};
