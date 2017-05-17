import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '../src';

storiesOf('Button', module)
  .add('First Story', () => (
    <button onClick={linkTo('Button', 'Second Story')}>Go to "Second Story"</button>
  ))
  .add('Second Story', () => (
    <button onClick={linkTo('Button', 'First Story')}>Go to "First Story"</button>
  ))
  .add('Multiple Selection', () => (
    <MultipleStories onClick={linkTo('Button', (filter) => {
      return filter === 'First' ? 'First Story' : 'Second Story';
    })}/>
  ));

const MultipleStories = ({onClick}) => {
  return (
  <ul>
    <button onClick={onClick.bind(null, 'First')}>Go to "First Story"</button>
    <button onClick={onClick.bind(null, 'Second')}>Go to "Second Story"</button>
  </ul>);
}
