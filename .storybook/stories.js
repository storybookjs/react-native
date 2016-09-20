import React from 'react';
import { storiesOf } from '@kadira/storybook';

storiesOf('Button', module)
  .add('Hello World', () => (
    <button>"Hello World"</button>
  ))
  .add('Hello Earth', () => (
    <button>"Hello Earth"</button>
  ));
