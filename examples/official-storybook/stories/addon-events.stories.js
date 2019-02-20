import React from 'react';
import EventEmitter from 'eventemitter3';
import { storiesOf } from '@storybook/react';

import withEvents from '@storybook/addon-events';
import Logger from './Logger';

const EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const emitter = new EventEmitter();
const emit = emitter.emit.bind(emitter);

const eventHandler = name => payload => emit(Logger.LOG_EVENT, { name, payload });

Object.keys(EVENTS).forEach(event => emitter.on(EVENTS[event], eventHandler(EVENTS[event])));

const events = [
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
];

storiesOf('Addons|Events', module)
  .addParameters({
    options: {
      selectedPanel: 'storybook/events/panel',
    },
  })
  .addDecorator(withEvents({ emit, events }))
  .add('Logger', () => <Logger emitter={emitter} />);

const WithEvents = withEvents;
storiesOf('Addons|Events.deprecated', module)
  .addParameters({
    options: {
      selectedPanel: 'storybook/events/panel',
    },
  })
  .addDecorator(storyFn => (
    <WithEvents emit={emit} events={events}>
      {storyFn()}
    </WithEvents>
  ))
  .add('Logger', () => <Logger emitter={emitter} />);
