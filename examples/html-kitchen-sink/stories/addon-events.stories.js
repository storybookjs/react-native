import EventEmitter from 'eventemitter3';
import { storiesOf } from '@storybook/html';
import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import json from 'format-json';

import withEvents from '@storybook/addon-events';

import './addon-events.css';

const TEST_EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const emitter = new EventEmitter();
const emit = emitter.emit.bind(emitter);

const events = [];
const eventHandlers = Object.values(TEST_EVENTS).map(name => ({
  name,
  handler: payload => {
    events.push({ name, payload });
    addons.getChannel().emit(CoreEvents.FORCE_RE_RENDER);
  },
}));

const subscription = () => {
  eventHandlers.forEach(({ name, handler }) => emitter.on(name, handler));
  return () => eventHandlers.forEach(({ name, handler }) => emitter.removeListener(name, handler));
};

storiesOf('Addons|Events', module)
  .addDecorator(
    withEvents({
      emit,
      events: [
        {
          name: TEST_EVENTS.TEST_EVENT_1,
          title: 'Test event 1',
          payload: 0,
        },
        {
          name: TEST_EVENTS.TEST_EVENT_2,
          title: 'Test event 2',
          payload: 'Test event 2',
        },
        {
          name: TEST_EVENTS.TEST_EVENT_3,
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
          name: TEST_EVENTS.TEST_EVENT_4,
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
      ],
    })
  )
  .addDecorator(storyFn => {
    addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
    return storyFn();
  })
  .add(
    'Logger',
    () => `
      <div class="wrapper">
        <h1 class="title">Logger</h1>
        <dl>
          ${events
            .map(
              ({ name, payload }) => `
                <div class="item">
                  <dt>
                    <b>Event name:</b> ${name}
                  </dt>
                  <dd>
                    <b>Event payload:</b> ${json.plain(payload)}
                  </dd>
                </div>
              `
            )
            .join('')}
        </dl>
      </div>
    `
  );
