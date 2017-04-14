# Storybook Addon Events

This [Storybook](https://getstorybook.io) addon allows you to add events for your stories.

![Storybook Addon Events Demo](docs/Demo.png)

### Getting Started
**note: addons require @kadira/storybook 2.x or greater*

```sh
npm i --save-dev @z4o4z/storybook-addon-events
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@kadira/storybook/addons';
import '@z4o4z/storybook-addon-events/register';
```

Then write your stories like this:

```js
import React from 'react';
import EventEmiter from 'event-emiter';
import { storiesOf } from '@kadira/storybook';
import WithEvents from '@z4o4z/storybook-addon-events';
import MyContainerWithEmiter from './MyContainerWithEmiter';

const emiter = new EventEmiter();

storiesOf('Button', module)
  .add('with text', () => (
    <WithEvents
      emit={emiter.emit}
      toggleLike={{
        title: 'Toggle like 1',
        name: 'togle-like',
        payload: {},
      }}
      toggleLike2={{
        title: 'Toggle like 2',
        name: 'togle-like-2',
        payload: {},
      }}
    >
    <MyContainerWithEmiter emiter={emiter}/>
  </WithEvents>
  ));
```
