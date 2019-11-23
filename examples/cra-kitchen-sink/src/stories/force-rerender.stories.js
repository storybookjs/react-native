import React from 'react';
import { forceReRender } from '@storybook/react';

let count = 0;
const increment = () => {
  count += 1;
  forceReRender();
};

export default {
  title: 'Force ReRender',
};

export const Button = () => (
  <Button type="button" onClick={increment}>
    Click me to increment: {count}
  </Button>
);
