import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { action } from '@kadira/storybook-addon-actions';
import {
  withKnobs,
  number,
  object,
  boolean,
  text,
} from '../index';

import Button from './Button';

storiesOf('Button', module)
  .addDecorator((story, context) => (withKnobs(story)(context)))
  .add('default view', () => (
    <Button
      onClick={ action('button clicked') }
      width={number('width(px)', 70)}
      disabled={boolean('disabled', false)}
      style={object('style', { width: '70px' })}
    >
      {text('Label', 'Hello')}
    </Button>
  ))
  // .add('default view with different knobs', () => (
  //   <Button
  //     onClick={ action('button clicked') }
  //     color={knob('color', 'string', '#abc')}
  //     width={knob('width(px)', 'number', 70)}
  //     disabled={knob('disabled', 'boolean', false)}
  //   >
  //     {knob('text', 'Hello')}
  //   </Button>
  // ))
  // .add('Story without any knobs', () => (
  //   <Button>Hello</Button>
  // ));
