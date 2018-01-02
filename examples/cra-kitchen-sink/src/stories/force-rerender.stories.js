import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';

let count = 0;
const increment = () => {
  count += 1;
  forceReRender();
};

storiesOf('Force ReRender', module).add('button', () => (
  <button onClick={increment}> Click me to increment: {count} </button>
));
