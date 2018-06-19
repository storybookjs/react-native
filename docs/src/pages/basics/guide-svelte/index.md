---
id: 'guide-svelte'
title: 'Storybook for Svelte'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you understand how Storybook works.

## Starter Guide Svelte

Storybook has its own Webpack setup and a dev server.

The Webpack setup is very similar to [Svelte CLI's](https://github.com/sveltejs/svelte-cli), but allows you to [configure it however you want](/configurations/custom-webpack-config/).

In this guide, we are trying to set up Storybook for your Svelte project.

> It is very important to remember that Svelte is precompiled from .svelte files
to vanilla javascript, so there is no runtime and anything you wish to integrate
with it is no different from plain old js.

## Table of contents

-   [Add @storybook/svelte](#add-storybooksvelte)
-   [Create the NPM script](#create-the-npm-script)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/svelte

First of all, you need to add `@storybook/svelte` to your project. To do that, simply run:

```sh
yarn add @storybook/svelte --dev
```

## Create the NPM script

Add the following NPM script to your `package.json` in order to start the storybook later in this guide:

```json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -c .storybook"
  }
}
```

Those flags mean port (-p) 9001 and configuration (-c) located in the .storybook directory.

## Create the config file

Storybook can be configured in several different ways.

That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

Here's an example `.storybook/config.js` to get you started:

```js
import { configure } from '@storybook/svelte';

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);
```

> This stories folder is just an example, you can load stories from wherever you want to.
> We think stories are best located close to the source files.

## Write your stories

Now you can write some stories inside the `../stories/index.js` file, like this:

```js
// Story about MyButton
import { storiesOf } from '@storybook/svelte';

import MyButton from '../components/MyButton.svelte';

storiesOf('MyButton', module)
  .add('simple component example', () => ({
    Component: MyButton,

    data: {
      rounded: true
    },

    on: {
      click: event => {
        console.log('clicked', event);
      }
    }
  }));
```

Svelte storybooks don't support using templates in a story yet. Instead,
you can create a .svelte file to compose components together, or simply to access
all normal Svelte functionality, like slots.

So you can create a story "view" file, essentially just a .svelte file to load
your components into to test.

```html
<!-- MyButtonView  -->
<MyButton rounded="{rounded}" on:click>
  {buttonText}
</Button>
```

In this example, the `on:click` that is heard on the `MyButton` component is
simply passed up to the containing component `MyButtonView` using the svelte
shorthand. It's the equivalent to `on:click="fire('click', event)"`, but it's
worth knowing about especially in this "component wrapper" scenario.

> If your component doesn't use slots, you don't need to do this, but if it does
or some other svelte functionality that requires the component to exist in a svelte
view, then this is how to do that.

You would then write a story for this "view" the exact same way you did with a component.

```js
// MyButtonView
import { storiesOf } from '@storybook/svelte';

import MyButtonView from '../views/MyButtonView.svelte';

storiesOf('MyButtonView', module)
  .add('wrapped component(s) example', () => ({
    Components: MyButtonView,

    data: {
      buttonText: 'Some button text',
      rounded: true
    },

    on: {
      click: (event) => {
        console.log('clicked', event);
      }
    }
  }));
```

Each story represents a single state of your component.

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
yarn storybook
```

Now you can change components and write stories whenever you need to.
You'll get those changes into Storybook in a snap with the help of Webpack's HMR API.
