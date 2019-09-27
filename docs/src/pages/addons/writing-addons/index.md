---
id: 'writing-addons'
title: 'Writing Addons'
---

This is a complete guide on how to create addons for Storybook.

## Storybook Basics

Before we begin, we need to learn a bit about how Storybook works. Basically, Storybook has a **Manager App** and a **Preview Area**.

Manager App is the client side UI for Storybook. Preview Area is the place where the story is rendered. Usually the Preview Area is an iframe.

When you select a story from the Manager App, the relevant story is rendered inside the Preview Area.

![Storybook Components](../static/storybook-components.png)

As shown in the above image, there's a communication channel that the Manager App and Preview Area use to communicate with each other.

## Capabilities

With an addon, you can add more functionality to Storybook. Here are a few things you could do:

- Add a panel to Storybook (like Action Logger).
- Add a tool to Storybook (like zoom or grid).
- Add a tab to Storybook (like notes).
- Interact/communicate with the iframe/manager.
- Interact/communicate with other addons.
- Change storybook's state using it's APIs.
- Navigating.
- Register keyboard shortcuts (coming soon).

With this, you can write some pretty cool addons. Look at our [Addon gallery](https://storybook.js.org/addons/) to have a look at some sample addons.

## Getting Started

Let's write a simplistic addon for Storybook. We'll add some metadata to the story, which the addon can then use.

### Add simple metadata using parameters

We write a story for our addon like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module)
  .add('with text', () => <Button>Hello Button</Button>, {
    myAddon: {
      data: 'this data is passed to the addon',
    },
  });
```

### Add a panel

We write an addon that responds to a change in story selection like so:

```js
// register.js

import React from 'react';
import { STORY_RENDERED } from '@storybook/core-events';
import { addons, types } from '@storybook/addons';
import { useParameter } from '@storybook/api';
import { AddonPanel } from '@storybook/components';

const ADDON_ID = 'myaddon';
const PARAM_KEY = 'myAddon';
const PANEL_ID = `${ADDON_ID}/panel`;

const MyPanel = () => {
  const value = useParameter(PARAM_KEY, null);
  
  return <div>{value}</div>;
}

addons.register(ADDON_ID, api => {
  const render = ({ active, key }) => (
    <AddonPanel active={active} key={key}>
      <MyPanel />
    </AddonPanel>
  );
  const title = 'My Addon';

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title,
    render,
    paramKey: PARAM_KEY,
  });
});
```

### register the addon

Then create an `addons.js` inside the Storybook config directory and add the following content to it.

```js
import 'path/to/register.js';
```

Now restart/rebuild storybook and the addon should show up!
When changing stories, the addon's onStoryChange method will be invoked with the new storyId.

#### Note:
If you get an error similar to:

```
ModuleParseError: Module parse failed: Unexpected token (92:22)
You may need an appropriate loader to handle this file type.
|       var value = this.state.value;
|       var active = this.props.active;
>       return active ? <div>{value}</div> : null;
|     }
|   }]);
```

It is likely because you do not have a `.babelrc` file or do not have it configured with the correct presets `{ "presets": ["@babel/preset-env", "@babel/preset-react"] }`

## A more complex addon

If we want to create a more complex addon, one that wraps the component being rendered for example, there are a few more steps.
Essentially you can start communicating from and to the manager using the storybook API.

Now we need to create two files, `register.js` and `index.js,`. `register.js` will be loaded by the manager (the outer frame) and `index.js` will be loaded in the iframe/preview. If you want your addon to be framework agnostic, THIS is the file where you need to be careful about that.

## Creating a decorator

Let's add the following content to the `index.js`. It will expose a decorator called `withFoo` which we use the `.addDecorator()` API to decorate all our stories.

The `@storybook/addons` package contains a `makeDecorator` function which we can easily use to create such a decorator:

```js
import React from 'react';
import addons, { makeDecorator } from '@storybook/addons';

export default makeDecorator({
  name: 'withMyAddon',
  parameterName: 'myParameter',
  // This means don't run this decorator if the notes decorator is not set
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { parameters }) => {
    const channel = addons.getChannel();

    // Our simple API above simply sets the notes parameter to a string,
    // which we send to the channel
    channel.emit('my/customEvent', parameters);
    // we can also add subscriptions here using channel.on('eventName', callback);

    return getStory(context);
  }
})
```

In this case, our component can access something called the channel. It lets us communicate with the panel (in the manager).
It has a NodeJS [EventEmitter](https://nodejs.org/api/events.html) compatible API.

In the above case, it will emit the notes' text to the channel, so our panel can listen to it.

Then add the following code to the `register.js`.

The storybook API itself has `.on()`, `.off()` and `.emit()` methods just like the [EventEmitter](https://nodejs.org/api/events.html).

A very convenient way of using the channel in the manager is using the `useChannel` hook.

```js
import React from 'react';
import addons from '@storybook/addons';
import { useChannel } from '@storybook/api';
import { STORY_CHANGED } from '@storybook/core-events';

const MyPanel = () => {
  const emit = useChannel({
    STORY_RENDERED: id => { /* do something */ },
    'my/customEvent': () => { /* so something */ },
  });

  return <button onClick={() => emit('my/otherEvent')}>click to emit</button>;
}

// Register the addon with a unique name.
addons.register('my/addon', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('my/addon/panel', {
    title: 'My Addon',
    render: ({ active, key }) => (
      <AddonPanel key={key} active={active}>
        <MyPanel />
      </AddonPanel>
    ),
  });
});
```

It will register our addon and add a panel. In that we'll render React component called `MyPanel`.

Using the hook, we'll listen for events and gain access to the `emit` function for emitting events from our component.

> In this example, we are only sending messages from the Preview Area to the Manager App (our panel).

It also listens to another event, called onStory, in the storybook API, which fires when the user selects a story.

Multiple addons can be loaded, but only a single panel can be shown, the render function will receive an `active` prop, which is true if the addon is shown. It is up to you to decide if this mean your component must be unmounted, or just visually hidden. This allows you to keep state but unmount expensive renderings.

The `AddonPanel` component will stop rendering of it's children if it's `active`-prop is false.

A great way of preserving state even when your component is unmounted is using the `useAddonState` hook:

```js
export const Panel = () => {
  const [state, setState] = useAddonState('my/addon-id', 'initial state');

  return (
    <button onClick={() => setState('a new value')}>
      the state = "{state}"
    </button>
  );
}
```

This will store your addon's state into storybook core state, and so when your component gets unmounted & remounted, the state will just be restored.

This is also a great way to sync state between multiple components of the same addon.

### Using the complex addon

Add the `register.js` to your `addons.js` file.

Then you need to start using the decorator:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import withMyAddon from 'path/to/index.js';

import Button from './Button';

storiesOf('Button', module)
  .addDecorator(withMyAddon)
  .add('with text', () => <Button>Hello Button</Button>, {
    myParameter: {
      data: 'awesome',
    },
  });
```

### Disabling an addon panel

It's possible to disable an addon panel for a particular story.
 
To offer that capability, you need to pass the paramKey when you register the panel
```js
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: () => <div>Addon tab content</div>,
    paramKey: 'myAddon',
  });
});
```

While adding a story, you can then pass a `disabled` parameter.

```js
storiesOf('Button', module)
  .add('with text', () => <Button>Hello Button</Button>, {
    myAddon: {
      disabled: true,
    },
  });
```


## Styling your addon

We use [emotion](https://emotion.sh) for styling, AND we provide a theme which can be set by the user!

We highly recommend you also use emotion to style your components for storybook, but it's not a requirement. You can use inline styles or another css-in-js lib. You can receive the theme as a prop by using the `withTheme` hoc from emotion. [Read more about theming](/configurations/theming).

But if you do use emotion, you can use the active storybook theme, which benefits users.

## Re-using existing components

Wouldn't it be awesome if we provided you with some common used components you could use to build out your own addon quickly and fit in right away?
Good news! WE DO! We publish most of storybook's UI components as a package: `@storybook/components`. You can check them out in [our storybook](https://storybooks.netlify.com) (pretty meta right?).

## Addon API

Here we've only used a few functionalities of our [Addon API](/addons/api).
You can learn more about the complete API [here](/addons/api).

## Packaging

You can package this addon into a NPM module very easily. As an example, have a look at this [package](https://github.com/storybookjs/storybook/tree/master/addons/notes).

In addition to moving the above code to a NPM module, we've set `react` and `@storybook/addons` as peer dependencies.

### Local Development

When you are developing your addon as a package, you can't use `npm link` to add it to your project. Instead add your package as a local dependency into your `package.json` as shown below:

```json
{
  "dependencies": {
    "@storybook/addon-notes": "file:///home/username/myrepo"
  }
}
```

### Package Maintenance

Your packaged Storybook addon needs to be written in ES5. If you are using ES6, then you need to transpile it.
