import React from 'react';
import EventEmitter from 'eventemitter3';

import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { withNotes, WithNotes } from '@storybook/addon-notes';
import WithEvents from '@storybook/addon-events';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { Button } from '@storybook/react/demo';

import App from '../App';
import Logger from './Logger';
import Container from './Container';

const EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const emitter = new EventEmitter();
const emit = emitter.emit.bind(emitter);

const InfoButton = () => (
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: 'rgb(34, 136, 204)',
      color: 'rgb(255, 255, 255)',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' '}
    Show Info{' '}
  </span>
);

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      Hello Button
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      😀 😎 👍 💯
    </Button>
  ))
  .add('with notes', () => (
    // deprecated usage
    <WithNotes notes="A very simple button">
      <Button>
        {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
        Check my notes in the notes panel
      </Button>
    </WithNotes>
  ))
  .addWithInfo(
    'with some info',
    'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its painful API.',
    context => (
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )
  )
  .add(
    'with new info',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context => (
      <Container>
        {setOptions({ selectedAddonPanel: 'storybook/info/info-panel' })}
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    ))
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(
      withNotes('Composition: Info(Notes())')(context => (
        <div>
          {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
          click the <InfoButton /> label in top right for info about "{context.story}"
        </div>
      ))
    )
  );

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Some really long story kind description', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('WithEvents', module)
  .addDecorator(getStory => (
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
  ))
  .add('Logger', () => <Logger emitter={emitter} />);
