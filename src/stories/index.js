import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from './Button';

storiesOf('Button', module)
  .addWithKnobs('default view', (context, createKnob) => (
    <Button
      onClick={ action('button clicked') }
      color={createKnob('color', '#fff')}
      style={createKnob('style', { width: '50px' }, 'object')}
    >
      {createKnob('children', 'Hello')}
    </Button>
  ))
  .add('some emojies as the text', () => (
    <Button>😀 😎 👍 💯</Button>
  ));
