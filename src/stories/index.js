import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from '../index';

storiesOf('Button', module)
  .add('default view', () => (
    <Button onClick={ action('button clicked') }>Hello</Button>
  ))
  .add('some emojies as the text', () => (
    <Button>😀 😎 👍 💯</Button>
  ))
  .add('custom styles', () => {
    const style = {
      fontSize: 20,
      textTransform: 'uppercase',
      color: '#FF8833',
    };
    return (
      <Button style={ style }>Hello</Button>
    );
  });
