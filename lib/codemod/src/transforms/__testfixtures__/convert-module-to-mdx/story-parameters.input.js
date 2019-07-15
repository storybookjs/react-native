import React from 'react';
import Button from './Button';

import { storiesOf } from '@storybook/react';

export default {
  title: 'Button',
};

export const story1 = () => <Button label="The Button" />;
story1.story = {
  name: 'with story parameters',
  parameters: {
    header: false,
    inline: true,
  },
};

export const foo = () => <Button label="Foo" />;
foo.story = {
  parameters: {
    bar: 1,
  },
};
