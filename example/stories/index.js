import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { action } from '@kadira/storybook-addon-actions';
import {
  withKnobs,
  number,
  object,
  boolean,
  text,
} from '../../src';

import Button from './Button';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('default view', () => (
    <Button
      onClick={ action('button clicked') }
      disabled={ boolean('Disabled', false) }
      width={ number('Width', 100) }
      style={ object('Style', { backgroundColor: '#FFF' }) }
    >
      { text('Label', 'Hello Man23') } World
    </Button>
  ))
  .add('Story without any knobs', () => (
    <Button>{text('Label', 'Hello')}</Button>
  ));
