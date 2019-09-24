/* eslint-disable */
import React from 'react';
import Button from './Button';

export default {
  title: 'Button',
};

export const withStoryParameters = () => <Button label="The Button" />;

withStoryParameters.story = {
  name: 'with story parameters',

  parameters: {
    header: false,
    inline: true,
  },
};

export const foo = () => <Button label="Foo" />;

foo.story = {
  name: 'foo',

  parameters: {
    bar: 1,
  },
};
