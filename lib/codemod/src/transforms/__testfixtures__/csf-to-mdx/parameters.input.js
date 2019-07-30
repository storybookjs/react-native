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

export const story1 = () => <Button label="The Button" />;
story1.story = { name: 'with kind parameters' };
