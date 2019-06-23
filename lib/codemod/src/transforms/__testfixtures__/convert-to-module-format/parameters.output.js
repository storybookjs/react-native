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

export const story1 = () => <Button label="The Button" />;
story1.title = 'with kind parameters';
