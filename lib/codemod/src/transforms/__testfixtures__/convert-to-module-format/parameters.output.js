/* eslint-disable */
import React from 'react';
import Button from './Button';

export default {
  title: 'Button',

  parameters: {
    component: Button,
    foo: 1,
    bar: 2,
  },
};

export const withKindParameters = () => <Button label="The Button" />;

withKindParameters.story = {
  name: 'with kind parameters',
};
