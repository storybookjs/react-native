import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { action, decorateAction } from '../src';

const pickFirst = decorateAction([
  args => args.slice(0, 1)
]);

storiesOf('Button', module)
  .add('Hello World', () => (
    <button onClick={action('Hello World')}>Hello World</button>
  ))
  .add('Decorated Action', () => (
    <button onClick={pickFirst('First Argument')}>First Argument</button>
  ));
