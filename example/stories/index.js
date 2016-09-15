import React from 'react';
import moment from 'moment';
import { storiesOf } from '@kadira/storybook';
import { action } from '@kadira/storybook-addon-actions';
import {
  withKnobs,
  number,
  object,
  boolean,
  text,
  select,
  date
} from '../../src';

import Button from './Button';

const today = new Date();

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('default view', () => (
    <Button
      onClick={ action('button clicked') }
      disabled={ boolean('Disabled', false) }
      color={ select('Height', { red: 'Red', blue: 'Blue', yellow: 'Yellow' }, 'red') }
      width={ number('Width', 100) }
      style={ object('Style', { backgroundColor: '#FFF' }) }
    >
      { text('Label', 'Hello Man23') } World
      <br/>
      { date('Date', today).toString() }
    </Button>
  ))
  .add('Story without any knobs', () => (
    <Button>{text('Label', 'Hello')}</Button>
  ));
