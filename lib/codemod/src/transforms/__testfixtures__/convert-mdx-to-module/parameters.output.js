import React from 'react';
import Button from './Button';
import { storiesOf } from '@storybook/react';

export default {
  title: 'Button',
  component: Button,

  parameters: {
    foo: 1,
    bar: 2,
  },
};

export const withKindParameters = () => <Button label="The Button" />;

withKindParameters.story = {
  name: 'with kind parameters',
};
