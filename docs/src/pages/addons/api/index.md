---
id: 'api'
title: 'API'
---

## Core Addon API

This is the core addon API. This is how to get the addon API:

```jsx
import { addons } from '@storybook/addons';
```

Have a look at the API methods for more details:

### addons.getChannel()

Get an instance to the channel where you can communicate with the manager and the preview. You can find this in both the addon register code and in your addon’s wrapper component (where used inside a story).

It has a NodeJS [EventEmitter](https://nodejs.org/api/events.html) compatible API. So, you can use it to emit events and listen for events.

### addons.register()

This method allows you to register an addon and get the storybook API. You can do this only in the Manager App.
See how we can use this:

```jsx
import { addons } from '@storybook/addons';

// Register the addon with a unique name.
addons.register('my-organisation/my-addon', api => {});
```

Now you'll get an instance to our StorybookAPI. See the [api docs](/addons/api#storybook-api) for Storybook API regarding using that.

### addons.add()

This method allows you to add a panel to Storybook. (Storybook's Action Logger is a panel). You can do this only in the Manager App.
See how you can use this method:

```jsx
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

const MyPanel = () => <div>This is a panel.</div>;

// give a unique name for the panel
addons.add('my-organisation/my-addon/panel', {
  title: 'My Addon',
  type: types.PANEL,
  render: ({ active, key }) => (
    <AddonPanel active={active} key={key}>
      <MyPanel />
    </AddonPanel>
  ),
});
```

The render function is called with `active` and `key`.

When the panel is in focus in the UI, the `active` will be true.

As you can see, you can set any React Component as the panel. Currently, it's one line of text. But you can do anything you want. You should specify the panel title. It could be a plain text.

## makeDecorator API

The `makeDecorator` API can be used to create decorators in the style of the official addons. Use it like so:

```jsx
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

---

## Storybook hooks

Writing addons can be simplified a lot by using these Storybook hooks:

### useStorybookState

```js
export const Panel = () => {
  const state = useStorybookState();

  return <div>do something with storybook's state</div>;
}
```

Allows full access to the entire storybook state.
Your component will re-render whenever the storybook state changes.

If you use this, remember your component wil be re-rendered a lot, and you may need to optimize for that using `React.memo` or `useMemo` or `PureComponent`.

### useStorybookApi

```js
export const Panel = () => {
  const state = useStorybookApi();

  return <div>do something with storybook's api</div>;
}
```

Allows full access to the storybook API.

Detail on the storybook api are further down.

### useChannel
```js
import { STORY_CHANGED } from '@storybook/core-events';
export const Panel = () => {
  const emit = useChannel({
    STORY_CHANGED: (...args) => console.log(...args),
  });

  return (
    <button onClick={() => emit('my-event-type', { some: 'data' })}>
      clicking this will emit an event
    </button>
  );
}
```

Allows for both setting subscriptions to events and getting the emitter for emitting custom event unto the channel.

The messages can be listened for on both the iframe and the manager side.

### useAddonState

```js
export const Panel = () => {
  const [state, setState] = useAddonState('my/addon-id', 'initial state');

  return (
    <button onClick={() => setState('a new value')}>
      the state = "{state}"
    </button>
  );
}
export const Tool = () => {
  const [state, setState] = useAddonState('my/addon-id', 'initial state');

  return (
    <button onClick={() => setState('a new value')}>
      the state = "{state}"
    </button>
  );
}
```

Extremely useful for addons that need to persist some state.

Storybook may unmount your addon component, and so keeping local state, might not work really well.

Also some addons consist of multiple parts, some part being in a panel, some in the toolbar etc.

With this hook they can all get access to the same bit of state which is persisted even if the components are unmounted.

### useParameter

```js
export const Panel = () => {
  const value = useParameter('parameter-key', 'default value');

  return (
    <div>
      for the currently selected story, the parameter for "parameter-key" is:
      {value}
    </div>
  );
}
```

This hook gets you the current story's parameter.

If the parameter isn't set, the default value (second argument) is returned instead.

---

## Storybook API

Storybook API allows you to access different functionalities of Storybook UI. You can move an instance to the Storybook API when you register an addon.

Let's have a look at API methods.

### api.selectStory()

With this method, you can select a story via an API. This method accepts two parameters.

1.  story kind name
2.  story name (optional)

Let's say you've got a story like this:

```jsx
export default {
  title: 'heading',
};

export const withText = () => <h1>Hello world</h1>;
```

This is how you can select the above story:

```jsx
addons.register('my-organisation/my-addon', api => {
  api.selectStory('heading', 'withText');
});
```

### api.selectInCurrentKind()

Same as `selectStory`, but accepts a story inside current kind as the only parameter:

```jsx
addons.register('my-organisation/my-addon', api => {
  api.selectInCurrentKind('withText');
});
```

### api.setQueryParams()

This method allows you to set query string parameters. You can use that as temporary storage for addons. Here's how you set query params.

```jsx
addons.register('my-organisation/my-addon', api => {
  api.setQueryParams({
    abc: 'this is abc',
    bbc: 'this is bbc',
  });
});
```

> If you need to remove a query param, use `null` for that. For an example, let's say we need to remove bbc query param. This is how we do it:

```jsx
addons.register('my-organisation/my-addon', api => {
  api.setQueryParams({
    bbc: null,
  });
});
```

### api.getQueryParam()

This method allows you to get a query param set by above API `setQueryParams`. For example, let's say we need to get the bbc query param. Then this how we do it:

```jsx
addons.register('my-organisation/my-addon', api => {
  api.getQueryParam('bbc');
});
```

### api.getUrlState(overrideParams)

This method allows you to get application url state with some changed params. For example, if you want to get a link to a particular story:

```jsx
addons.register('my-organisation/my-addon', api => {
  const href = api.getUrlState({
    selectedKind: 'kind',
    selectedStory: 'story',
  }).url;
});
```

### api.on(eventName, fn)

This method allows you to register a handler function which will be called whenever the user navigates between stories.

```jsx
addons.register('my-organisation/my-addon', api => {
  api.on('some-event', (eventData) => console.log(eventData));
});
```
