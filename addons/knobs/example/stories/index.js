import React from 'react';
import { storiesOf } from '@storybook/react';
import moment from 'moment';
import { withKnobs, number, object, boolean, text, select, date, array, color } from '../../src';

const stories = storiesOf('Example of Knobs', module);

stories.addDecorator(withKnobs);

stories.add('simple example', () => <button>{text('Label', 'Hello Button')}</button>);

stories.add('with all knobs', () => {
  const name = text('Name', 'Tom Cary');
  const dob = date('DOB', new Date('January 20 1887'));

  const bold = boolean('Bold', false);
  const selectedColor = color('Color', 'black');
  const favoriteNumber = number('Favorite Number', 42);
  const comfortTemp = number('Comfort Temp', 72, { range: true, min: 60, max: 90, step: 1 });

  const passions = array('Passions', ['Fishing', 'Skiing']);

  const customStyle = object('Style', {
    fontFamily: 'Arial',
    padding: 20,
  });

  const style = {
    ...customStyle,
    fontWeight: bold ? 800 : 400,
    favoriteNumber,
    color: selectedColor,
  };

  return (
    <div style={style}>
      I'm {name} and I was born on "{moment(dob).format('DD MMM YYYY')}"
      I like: <ul>{passions.map((p, i) => <li key={i}>{p}</li>)}</ul>
      <p>My favorite number is {favoriteNumber}.</p>
      <p>My most comfortable room temperature is {comfortTemp} degrees Fahrenheit.</p>
    </div>
  );
});

stories.add('dates Knob', () => {
  const today = date('today');
  const dob = date('DOB', null);
  const myDob = date('My DOB', new Date('July 07 1993'));

  return (
    <ul style={{ listStyleType: 'none', listStyle: 'none', paddingLeft: '15px' }}>
      <li>
        <p><b>Javascript Date</b> default value, passes date value</p>
        <blockquote>
          <code>const myDob = date('My DOB', new Date('July 07 1993'));</code>
          <pre>// I was born in: "{moment(myDob).format('DD MMM YYYY')}"</pre>
        </blockquote>
      </li>
      <li>
        <p><b>undefined</b> default value passes today's date</p>
        <blockquote>
          <code>const today = date('today');</code>
          <pre>// Today's date is: "{moment(today).format('DD MMM YYYY')}"</pre>
        </blockquote>
      </li>
      <li>
        <p><b>null</b> default value passes null value</p>
        <blockquote>
          <code>const dob = date('DOB', null);</code>
          <pre>
            // You were born in: "{dob ? moment(dob).format('DD MMM YYYY') : 'Please select date.'}"
          </pre>
        </blockquote>
      </li>
    </ul>
  );
});

stories.add('dynamic knobs', () => {
  const showOptional = select('Show optional', ['yes', 'no'], 'yes');
  return (
    <div>
      <div>
        {text('compulsary', 'I must be here')}
      </div>
      {showOptional === 'yes' ? <div>{text('optional', 'I can disapear')}</div> : null}
    </div>
  );
});

stories.add('without any knob', () => <button>This is a button</button>);
