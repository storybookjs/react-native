---
id: 'api'
title: 'API'
---

## Core Addon API

This is the core addon API. This is how to get the addon API:

```js
import addonAPI from '@storybook/addons';
```

Have a look at the API methods for more details:

### addonAPI.getChannel()

Get an instance to the channel where you can communicate with the manager and the preview. You can find this in both the addon register code and in your addon’s wrapper component (where used inside a story).

It has a NodeJS [EventEmitter](https://nodejs.org/api/events.html) compatible API. So, you can use it to emit events and listen for events.

### addonAPI.register()

This method allows you to register an addon and get the storybook API. You can do this only in the Manager App.
See how we can use this:

```js
import addonAPI from '@storybook/addons';

// Register the addon with a unique name.
addonAPI.register('my-organisation/my-addon', storybookAPI => {});
```

Now you'll get an instance to our StorybookAPI. See the [api docs](/addons/api#storybook-api) for Storybook API regarding using that.

### addonAPI.addPanel()

This method allows you to add a panel to Storybook. (Storybook's Action Logger is a panel). You can do this only in the Manager App.
See how you can use this method:

```js
import addonAPI from '@storybook/addons';

const MyPanel = () => <div>This is a panel.</div>;

// give a unique name for the panel
addonAPI.addPanel('my-organisation/my-addon/panel', {
  title: 'My Addon',
  render: () => <MyPanel />,
});
```

As you can see, you can set any React Component as the panel. Currently, it's just a text. But you can do anything you want. You should specify the panel title. It could be a plain text or a function returning any React Component.

You also pass the channel and the Storybook API into that. See:

```js
import addonAPI from '@storybook/addons';

import Notes from './notes';

addonAPI.register('my-organisation/my-addon', storybookAPI => {
  // Also need to set a unique name to the panel.
  addonAPI.addPanel('my-organisation/my-addon/panel', {
    title: 'Notes',
    render: () => <Notes channel={addonAPI.getChannel()} api={storybookAPI} />,
  });
});
```

## Storybook API

Storybook API allows you to access different functionalities of Storybook UI. You can move an instance to the Storybook API when you register an addon.

Let's have a look at API methods.

### storybookAPI.selectStory()

With this method, you can select a story via an API. This method accepts two parameters.

1.  story kind name
2.  story name (optional)

Let's say you've got a story like this:

```js
import { storiesOf } from '@storybook/react';

storiesOf('heading', module).add('with text', () => <h1>Hello world</h1>);
```

This is how you can select the above story:

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  storybookAPI.selectStory('heading', 'with text');
});
```

### storybookAPI.selectInCurrentKind()

Same as `selectStory`, but accepts a story inside current kind as the only parameter:

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  storybookAPI.selectInCurrentKind('with text');
});
```

### storybookAPI.setQueryParams()

This method allows you to set query string parameters. You can use that as temporary storage for addons. Here's how you set query params.

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  storybookAPI.setQueryParams({
    abc: 'this is abc',
    bbc: 'this is bbc',
  });
});
```

> If you need to remove a query param, use `null` for that. For an example, let's say we need to remove bbc query param. This is how we do it:

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  storybookAPI.setQueryParams({
    bbc: null,
  });
});
```

### storybookAPI.getQueryParam()

This method allows you to get a query param set by above API `setQueryParams`. For example, let's say we need to get the bbc query param. Then this how we do it:

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  storybookAPI.getQueryParam('bbc');
});
```

### storybookAPI.getUrlState(overrideParams)

This method allows you to get application url state with some changed params. For example, if you want to get a link to a particular story:

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  const href = storybookAPI.getUrlState({
    selectedKind: 'kind',
    selectedStory: 'story',
  }).url;
});
```

### storybookAPI.onStory(fn)

This method allows you to register a handler function which will be called whenever the user navigates between stories.

```js
addonAPI.register('my-organisation/my-addon', storybookAPI => {
  storybookAPI.onStory((kind, story) => console.log(kind, story));
});
```

## `makeDecorator` API

The `makeDecorator` API can be used to create decorators in the style of the official addons easily. Use it like so:

```js
import { makeDecorator } from '@storybook/addons';

export makeDecorator({
  name: 'withSomething',
  parameterName: 'something',
  wrapper: (storyFn, context, { parameters }) => {
    // Do something with `parameters`, which are set via { something: ... }

    // Note you may alter the story output if you like, although generally that's
    // not advised
    return storyFn(context);
  }
})
```

The options to `makeDecorator` are:

- `name`: The name of the export (e.g. `withFoo`)
- `parameterName`: The name of the parameter your addon uses. This should be unique.
- `skipIfNoParametersOrOptions`: Don't run your decorator if the user hasn't set options (via `.addDecorator(withFoo(options)))`) or parameters (`.add('story', () => <Story/>, { foo: 'param' })`, or `.addParameters({ foo: 'param' })`).
- `allowDeprecatedUsage`: support the deprecated "wrapper" usage (`.add('story', () => withFoo(options)(() => <Story/>))`).
- `wrapper`: your decorator function. Takes the `storyFn`, `context`, and both the `options` and `parameters` (as defined in `skipIfNoParametersOrOptions` above).

Note if the parameters to a story include `{ foo: { disable: true } }` (where `foo` is the `parameterName` of your addon), your decorator will not be called.
