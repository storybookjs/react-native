---
id: 'guide-mithril'
title: 'Storybook for Mithril'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you to understand how Storybook works.

## Starter Guide Mithril

Storybook has its own Webpack setup and a dev server.

In this guide, we will set up Storybook for your Mithril project.

## Table of contents

-   [Add @storybook/mithril](#add-storybookmithril)
-   [Add mithril and babel-core](#add-mithril-and-babel-core)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/mithril

First of all, you need to add `@storybook/mithril` to your project. To do that, simply run:

```sh
npm i --save-dev @storybook/mithril
```

## Add mithril and babel-core

Make sure that you have `mithril` and `babel-core` in your dependencies as well because we list these as a peerDependency:

```sh
npm i --save mithril
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
import { configure } from '@storybook/mithril';

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
/** @jsx m */

import m from 'mithril';

import { storiesOf } from '@storybook/mithril';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

storiesOf('Button', module)
  .add('with text', () => ({
    view: () => <Button onclick={action('clicked')}>Hello Button</Button>
  }))
  .add('with some emoji', () => ({
  	view: () => <Button onclick={action('clicked')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  }));
```

Story is a single state of your component. In the above case, there are two stories for the native button component:

1.  with text
2.  with some emoji

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Now you can change components and write stories whenever you need to.
