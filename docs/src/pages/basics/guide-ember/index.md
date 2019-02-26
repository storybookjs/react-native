---
id: 'guide-ember'
title: 'Storybook for Ember'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you to understand how Storybook works.

## Starter Guide Ember

Storybook has its own Webpack setup and a dev server.

In this guide, we will set up Storybook for your Ember project.

## Table of contents

-   [Add @storybook/ember](#add-storybookember)
-   [Setup environment](#setup-environment)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/ember

First of all, you need to add `@storybook/ember` to your project. To do that, simply run:

```sh
ember install @storybook/ember-cli-storybook
```

If you don't have `package.json` in your project, you'll need to init it first:

```sh
npm init
```

Then add the following NPM script to your package json in order to start the storybook later in this guide:

> In order for your storybook to run properly be sure to be either run `ember serve` or `ember build` before running any storybook commands. Running `ember serve` before storybook will enable live reloading.

```json
{
  "scripts": {
    "build-storybook": "ember build && build-storybook -p 9001 -s dist",
    "storybook": "ember serve & start-storybook -p 9001 -s dist"
  }
}
```

## Setup environment

Your environment will be preconfigured using `ember-cli-storybook`. This will add a `preview-head.html`, a `.env` and make sure that your environment is configured to work with live reload.

## Create the config file

Storybook can be configured in several different ways.
That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

For the basic Storybook configuration file, you don't need to do much, but simply tell Storybook where to find stories.

To do that, simply create a file at `.storybook/config.js` with the following content:

```js
import { configure } from '@storybook/ember';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```

That'll load stories in `../stories/index.js`.

## Write your stories

Now you can write some stories inside the `../stories/index.js` file, like this:

> It is import that you import the `hbs` function that is provided by a babel plugin in `@storybook/ember`

```js
import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';

storiesOf('Demo', module)
  .add('heading', () => hbs`<h1>Hello World</h1>`)
  .add('button', () => {
    return {
      template: hbs`<button {{action onClick}}>
        Hello Button
      </button>`,
      context: {
        onClick: (e) => console.log(e)
      }
    }
  })
  .add('component', () => {
    return {
      template: hbs`{{foo-bar
        click=onClick
      }}`,
      context: {
        onClick: (e) => console.log(e)
      }
    }
  });
```

> If you are using an older version of ember <= 3.1 please use this story style

```js
import { compile } from 'ember-source/dist/ember-template-compiler';
import { storiesOf } from '@storybook/ember';

storiesOf('Demo', module)
  .add('heading', () => compile(`<h1>Hello World</h1>`))
  .add('button', () => {
    return {
      template: compile(`<button {{action onClick}}>
        Hello Button
      </button>`),
      context: {
        onClick: (e) => console.log(e)
      }
    }
  })
  .add('component', () => {
    return {
      template: compile(`{{foo-bar
        click=onClick
      }}`),
      context: {
        onClick: (e) => console.log(e)
      }
    }
  });
```

A story is either:

1. A single handlebars fragment generated using the `hbs` function
2. An object that contains template and context that will be bound to the resulting element

> In order to get your storybook to get new changes made to the `foo-bar` or any other components that are defined in your Ember app you must run `ember serve` as a sidecar for the build files to get generated.

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Now you can change components and write stories whenever you need to.
