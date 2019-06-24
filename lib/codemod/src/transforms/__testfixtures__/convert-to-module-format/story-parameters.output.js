/* eslint-disable */
import React from 'react';
import Button from './Button';

export default {
  title: 'Button',
};

export const story1 = () => <Button label="The Button" />;
story1.title = 'with story parameters';

story1.parameters = {
  header: false,
  inline: true,
};

export const foo = () => <Button label="Foo" />;

foo.parameters = {
  bar: 1,
};
