---
id: 'storiesof-api'
title: 'StoriesOf API'
---

`storiesOf` is Storybook's API for adding stories. Up until Storybook 5.2, it has been the primary way to create stories in Storybook.

In Storybook 5.2 we introduced a simpler and more portable [Component Story Format](../component-story-format/), and all future tools and infrastructure will be oriented towards CSF. Therefore, we recommend migrating your stories out of `storiesOf` API, and even provide [automated tools to do this](#component-story-format-migration).

That said, the `storiesOf` API is not deprecated. For the time being most existing Storybooks use the `storiesOf` API, and therefore we plan to support it for the foreseeable future.

## storiesOf API

A Storybook is a collection of stories. Each story represents a single visual state of a component. For an overview of storybook story concepts, see ["Writing Stories"](../../basics/writing-stories/).

Here's a basic story file in the `storiesOf` API:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
```

The string argument to `storiesOf` is the component title. If you pass a string like `'Widgets|Button/Button'` it can also be used to position your component's story within [Storybook's story hierarchy](../../basics/writing-stories/#story-hierarchy).

Each `.add` call takes a story name, a story function that returns a renderable object (JSX in the case of React), and optionally some parameters, which are described below.

## Decorators and parameters

[Decorators](../../basics/writing-stories/#decorators) and [parameters](../../basics/writing-stories/#parameters) can be specified globally, at the component level, or locally at the story level.

Global decorators are parameters are specified in the Storybook config:

```js
addDecorator(storyFn => <blink>{storyFn()}</blink>);
addParameters({ foo: 1 });
```

Component-level decorators and parameters are supported as chained API calls:

```js
storiesOf('Button', module)
  .addDecorator(withKnobs)
  .addParameters({ notes: someNotes });
```

Story-level parameters are provided as a third argument to `.add`:

```js
storiesOf('Button', module).add(
  'with text',
  () => <Button onClick={action('clicked')}>Hello Button</Button>,
  { notes: someNotes }
);
```

And finally, story-level decorators are provided via parameters:

```js
storiesOf('Button', module).add(
  'with text',
  () => <Button onClick={action('clicked')}>Hello Button</Button>,
  { decorators: withA11y }
);
```

## Legacy loading

With the Component Story Format (CSF), we introduced a `load` API. To load the all `.stories.js` files, including `storiesOf` files, simply run the following in your Storybook config file:

```js
import { load } from '@storybook/react';

load(require.context('../src/components', true, /\.stories\.js$/), module);
```

The `load` API can also take an array of `require.context` `req`s, or a loader function. For more information see ["Loading stories"](../../basics/writing-stories/#loading-stories)

Prior to 5.2, we used an API called `configure` instead:

```js
import { configure } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

This example uses Webpack's [require.context](https://webpack.js.org/guides/dependency-management/#require-context) to load modules dynamically. Take a look at the relevant Webpack [docs](https://webpack.js.org/guides/dependency-management/#require-context) to learn more about how to use `require.context`.

Additionally, because `storiesOf` is simply an API, you can require individual files inside the configuration function, which allows you to precisely control which files are loaded and the specific load order.

```js
import { load } from '@storybook/react';

function loadStories() {
  require('../stories/Foo.stories.js');
  require('../stories/Bar.stories.js');
}

load(loadStories, module);
```

The **React Native** packager resolves all imports at build-time, so it's not possible to load modules dynamically. There is a third party loader [react-native-storybook-loader](https://github.com/elderfo/react-native-storybook-loader) to automatically generate the import statements for all stories.

## Component Story Format migration

To make it easier to adopt the new [Component Story Format (CSF)](../component-story-format/), we've created an automatic migration tool to transform `storiesOf` API to Module format.

```sh
sb migrate storiesof-to-csf --glob src/**/*.stories.js
```

For more information, see the CLI's [Codemod README](https://github.com/storybookjs/storybook/tree/next/lib/codemod).
