import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from './Button';
import { createKnob, wrap } from '../index';

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
  .add('default view 2', wrap(() => (
    <Button
      onClick={ action('button clicked') }
      color={createKnob('color', '#fff')}
      style={createKnob('style', { width: '70px' }, 'object')}
    >
      {createKnob('children', 'Hello')}
    </Button>
  )))
  .add('default view 3', wrap(() => (
    <Button
      onClick={ action('button clicked') }
      color={createKnob('paata', '#fff')}
      style={createKnob('style', { width: '70px' }, 'object')}
    >
      This is not a knob
    </Button>
  )))
  .add('some emojies as the text', () => (
    <Button>😀 😎 👍 💯</Button>
  ));
