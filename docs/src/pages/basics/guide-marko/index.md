---
id: 'guide-marko'
title: 'Storybook for Marko'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you to understand how Storybook works.

## Starter Guide Marko

Storybook has its own Webpack setup and a dev server.

In this guide, we will set up Storybook for your Marko project.

## Table of contents

-   [Add @storybook/marko](#add-storybookmarko)
-   [Add babel-runtime and babel-core](#add-babel-runtime-and-babel-core)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/marko

First of all, you need to add `@storybook/marko` to your project. To do that, simply run:

```sh
npm i --save-dev @storybook/marko
```

## Add babel-runtime and babel-core

Make sure that you have `babel-runtime` and `babel-core` in your dependencies as well because we list these as a peerDependency:

```sh
npm i --save babel-runtime
npm i --save-dev babel-core
```

Then add the following NPM script to your package json in order to start the storybook later in this guide:

```json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -c .storybook"
  }
}
```

## Create the config file

Storybook can be configured in several different ways. 
That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

For the basic Storybook configuration file, you don't need to do much, but simply tell Storybook where to find stories.

To do that, simply create a file at `.storybook/config.js` with the following content:

```js
import { configure } from '@storybook/marko';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```

That'll load stories in `../stories/index.js`.

## Write your stories

Now you can write some stories inside the `../stories/index.js` file, like this:

```js
import { storiesOf } from '@storybook/marko';
import { action } from '@storybook/addon-actions';
import Button from '../components/button/index.marko';

storiesOf('Button', module)
  .add('with action', () => Button.renderSync({ click: action('action logged!') }));
```

Story is a single state of your component.

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Now you can change components and write stories whenever you need to.
