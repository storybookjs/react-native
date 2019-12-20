import React from 'react';
import { forceReRender } from '@storybook/react';
import { Button } from '@storybook/react/demo';

let count = 0;
const increment = () => {
  count += 1;
  forceReRender();
};

export default {
  title: 'Force ReRender',
};

export const DefaultView = () => (
  <Button type="button" onClick={increment}>
    Click me to increment: {count}
  </Button>
);
