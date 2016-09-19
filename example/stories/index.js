import React from 'react';
import { storiesOf } from '@kadira/storybook';
import moment from 'moment';
import {
  withKnobs,
  number,
  object,
  boolean,
  text,
  select,
  date
} from '../../src';

storiesOf('Example of Knobs', module)
  .addDecorator(withKnobs)
  .add('simple example', () => (
    <button>{text('Label', 'Hello Button')}</button>
  ))
  .add('with all knobs', () => {
    const name = text('Name', 'Tom Cary');
    const dob = date('DOB', new Date('1889 Jan 20'));
    const bold = boolean('Bold', false);
    const color = select('Color', {
      red: 'Red',
      green: 'Green',
      black: 'Black'
    }, 'black');

    const customStyle = object('Style', {
      fontFamily: 'Arial',
      padding: 20,
    });

    const style = {
      ...customStyle,
      fontWeight: bold ? 800: 400,
      color
    };

    return (
      <div style={style}>
        I'm {name} and I born on "{moment(dob).format("DD MMM YYYY")}"
      </div>
    );
  })
  .add('without any knob', () => (
    <button>This is a button</button>
  ));
