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

## Table of contents

-   [Add @storybook/svelte](#add-storybooksvelte)
-   [Add svelte and babel-core](#add-svelte-and-babel-core)
-   [Create the NPM script](#create-the-npm-script)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/svelte

First of all, you need to add `@storybook/svelte` to your project. To do that, simply run:

```sh
npm i --save-dev @storybook/svelte
```

## Create the NPM script

Add the following NPM script to your `package.json` in order to start the storybook later in this guide:

    {
      "scripts": {
        "storybook": "start-storybook -p 9001 -c .storybook"
      }
    }

## Create the config file

Storybook can be configured in several different ways.
That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

There are 3 things you need to tell Storybook to do:

1.  Import and globally register with [`Svelte.component()`](https://sveltejs.org/v2/api/#Svelte-component) any global custom components just like you did with your project. (Note: [components registered locally](https://sveltejs.org/v2/guide/components.html#Local-Registration) will be brought in automatically).
2.  For any required Svelte plugins (e.g. `sveltex`), you'll also need to [install these with `Svelte.use`](https://sveltejs.org/v2/api/#Svelte-use).
3.  Require your stories.

Here's an example `.storybook/config.js` to get you started:

```js
import { configure } from '@storybook/svelte';

import Svelte from 'svelte';
import Sveltex from 'sveltex'; // Svelte plugins

// Import your custom components.
import Mybutton from '../src/stories/Button.svelte';

// Install Svelte plugins.
Svelte.use(Sveltex);

// Register custom components.
Svelte.component('my-button', Mybutton);

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);
```

This example registered your custom `Button.svelte` component, installed the Sveltex plugin, and loaded your Storybook stories defined in `../stories/index.js`.

All custom components and Svelte plugins should be registered before calling `configure()`.

> This stories folder is just an example, you can load stories from wherever you want to.
> We think stories are best located close to the source files.

## Write your stories

Now you can write some stories inside the `../stories/index.js` file, like this:

```js
import Svelte from 'svelte';

import { storiesOf } from '@storybook/svelte';

import MyButton from '../components/Button.svelte';

storiesOf('MyButton', module)
  .add('story as a template', () => '<my-button :rounded="true">story as a function template</my-button>')
  .add('story as a component', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }));
```

Each story is a single state of your component. In the above case, there are two stories for the MyButton component:

1.  story as a template
2.  story as a component

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Now you can change components and write stories whenever you need to.
You'll get those changes into Storybook in a snap with the help of Webpack's HMR API.
