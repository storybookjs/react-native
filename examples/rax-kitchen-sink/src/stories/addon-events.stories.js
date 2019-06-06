import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import withEvents from '@storybook/addon-events';
import ee from 'event-emitter';
import Logger, { EVENTS } from '../components/Logger';

const emitter = ee();

const decorator = withEvents({
  emit: emitter.emit.bind(emitter),
  events: [
    {
      name: EVENTS.TEST_EVENT_1,
      title: 'Test event 1',
      payload: 'hi',
    },
    {
      name: EVENTS.TEST_EVENT_2,
      title: 'Test event 2',
      payload: 'ho',
    },
    {
      name: EVENTS.TEST_EVENT_3,
      title: 'Test event 3',
      payload: {
        text: 'very complicated payload',
        number: 1,
      },
    },
  ],
});

storiesOf('Addon|addon-events', module)
  .addDecorator(decorator)
  .add('Events Logger', () => <Logger emitter={emitter} />);
