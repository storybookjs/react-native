import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { action } from '@kadira/storybook-addon-actions'
import { createKnob, wrap } from '../index';
import Button from './Button';

storiesOf('Button', module)
  .add('default view', wrap(() => (
    <Button
      onClick={ action('button clicked') }
      color={createKnob('color', '#fff')}
      style={createKnob('style', { width: '70px' }, 'object')}
    >
      {createKnob('children', 'Hello')}
    </Button>
  )))
  .add('default view with different knobs', wrap(() => (
    <Button
      onClick={ action('button clicked') }
      color={createKnob('color', '#abc')}
    >
      {createKnob('text', 'Hello')}
    </Button>
  )))
  .add('Story without any knobs', () => (
    <Button>Hello</Button>
  ));
