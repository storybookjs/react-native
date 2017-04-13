# Storybook Addon Events

This [Storybook](https://getstorybook.io) addon allows you to add events for your stories.

![Storybook Addon Events Demo](docs/demo.png)

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
import { WithEvents } from '@z4o4z/storybook-addon-events';
import MyContainerWithEmiter from './MyContainerWithEmiter';

const emiter = new EventEmmiter();

storiesOf('Button', module)
  .add('with text', () => (
    <WithEvents
      emit={emiter.emit}
      toggleLike={{
        title: 'Toggle like',
        name: 'togle-like',
        payload: {},
      }}
      like-fetched={{
        title: 'Toggle like',
        name: 'togle-like',
        payload: {},
      }}
    >
    <MyContainerWithEmiter emiter={emiter}/>
  </WithEvents>
  ));
```
