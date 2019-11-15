import React from 'react';
import LinkTo from '@storybook/addon-links/react';

export default {
  title: 'Addons/Links/Link',
};

export const First = () => <LinkTo story="Second">Go to Second</LinkTo>;
export const Second = () => <LinkTo story="First">Go to First</LinkTo>;
