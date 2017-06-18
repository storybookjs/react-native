import React from 'react';
import EventEmiter from 'eventemitter3';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { addonNotes, WithNotes } from '@storybook/addon-notes';
import { linkTo } from '@storybook/addon-links';
import WithEvents from '@storybook/addon-events';
import {
  withKnobs,
  addonKnobs,
  text,
  number,
  boolean,
  color,
  select,
  array,
  date,
  object,
} from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';

import Button from '@storybook/components/dist/demo/Button';
import Welcome from '@storybook/components/dist/demo/Welcome';

import App from '../App';
import Logger from './Logger';

const EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const emiter = new EventEmiter();
const emit = emiter.emit.bind(emiter);

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
  .add('with notes', () =>
    <WithNotes notes={'A very simple button'}>
      <Button>Check my notes in the notes panel</Button>
    </WithNotes>
  )
  .add('with knobs', () => {
    const name = text('Name', 'Storyteller');
    const age = number('Age', 70, { range: true, min: 0, max: 90, step: 5 });
    const fruits = {
      apple: 'Apple',
      banana: 'Banana',
      cherry: 'Cherry',
    };
    const fruit = select('Fruit', fruits, 'apple');
    const dollars = number('Dollars', 12.5);

    // NOTE: color picker is currently broken
    const backgroundColor = color('background', '#ffff00');
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const otherStyles = object('Styles', {
      border: '3px solid #ff00ff',
      padding: '10px',
    });
    const nice = boolean('Nice', true);

    // NOTE: put this last because it currently breaks everything after it :D
    const birthday = date('Birthday', new Date('Jan 20 2017'));

    const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}.`;
    const style = { backgroundColor, ...otherStyles };
    const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';

    return (
      <div style={style}>
        <p>{intro}</p>
        <p>My birthday is: {new Date(birthday).toLocaleDateString()}</p>
        <p>My wallet contains: ${dollars.toFixed(2)}</p>
        <p>In my backpack, I have:</p>
        <ul>
          {items.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p>{salutation}</p>
      </div>
    );
  })
  .addWithInfo(
    'with some info',
    'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its painful API.',
    () => <Button>click the "?" in top right for info</Button>
  );

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Centered Button', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('WithEvents', module)
  .addDecorator(getStory =>
    <WithEvents
      emit={emit}
      events={[
        {
          name: EVENTS.TEST_EVENT_1,
          title: 'Test event 1',
          payload: 0,
        },
        {
          name: EVENTS.TEST_EVENT_2,
          title: 'Test event 2',
          payload: 'Test event 2',
        },
        {
          name: EVENTS.TEST_EVENT_3,
          title: 'Test event 3',
          payload: {
            string: 'value',
            number: 123,
            array: [1, 2, 3],
            object: {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          },
        },
        {
          name: EVENTS.TEST_EVENT_4,
          title: 'Test event 4',
          payload: [
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          ],
        },
      ]}
    >
      {getStory()}
    </WithEvents>
  )
  .add('Logger', () => <Logger emiter={emiter} />);

storiesOf('addonNotes', module)
  .add('with some text', addonNotes({ notes: 'Hello guys' })(() => <div>Hello guys</div>))
  .add('with some emoji', addonNotes({ notes: 'My notes on emojies' })(() => <p>🤔😳😯😮</p>))
  .add(
    'with a button and some emoji',
    addonNotes({ notes: 'My notes on a button with emojies' })(() =>
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    )
  )
  .add('with old API', () =>
    <WithNotes notes="Hello">
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    </WithNotes>
  );

storiesOf('Addon Knobs deprecated Decorator', module)
  .addDecorator(withKnobs) // test deprecated
  .add('with dynamic variables deprecated', () => {
    const name = text('Name', 'Story Teller');
    const age = number('Age', 120);

    const content = `I am ${name} and I'm ${age} years old.`;
    return <div>{content}</div>;
  });

storiesOf('Addon Knobs', module).add(
  'with dynamic variables new method',
  addonKnobs()(() => {
    const name = text('Name', 'Arunoda Susiripala');
    const age = number('Age', 89);

    const content = `I am ${name} and I'm ${age} years old.`;
    return <div>{content}</div>;
  })
);
