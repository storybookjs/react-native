import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { action } from '../src';

storiesOf('Button', module)
  .add('Hello World', () => (
    <button onClick={action('Hello World')}>Hello World</button>
  ));
