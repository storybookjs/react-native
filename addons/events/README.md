# Storybook Addon Events

This [storybook](https://storybooks.js.org) ([source](https://github.com/storybookjs/storybook)) addon allows you to add events for your stories.

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

[Storybook Addon Events Live Demo](https://z4o4z.github.io/storybook-addon-events/index.html)

### Getting Started

```sh
npm i --save-dev @storybook/addon-events
```

within `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-events/register']
}
```

Then write your stories like this:

```js
import withEvents from '@storybook/addon-events';
import EventEmiter from 'event-emiter';

import Logger from './Logger';
import * as EVENTS from './events';

const emiter = new EventEmiter();
const emit = emiter.emit.bind(emiter);

export default {
  title: 'withEvents',
  decorators: [
    withEvents({
      emit,
      events: [
        {
          name: EVENTS.TEST_EVENT_1,
          title: 'Test event 1',
          payload: 0,
        },
        {
          name: EVENTS.TEST_EVENT_2,
          title: 'Test event 2',
          payload: 'asdasdad asdasdasd',
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
      ]
    }),
  ],
}

export const defaultView = () => (
  <Logger emiter={emiter} />
);
```
