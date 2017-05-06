import React from 'react';
import { storiesOf } from '@storybook/storybook';

storiesOf('Hello', module)
  .add('Hello World', () => (
    <pre>Hello World</pre>
  ))
  .add('Hello Earth', () => (
    <pre>Hello Earth</pre>
  ));
