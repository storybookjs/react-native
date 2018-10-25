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
npm i --save-dev @storybook/ember
```

If you don't have `package.json` in your project, you'll need to init it first:

```sh
npm init
```

Then add the following NPM script to your package json in order to start the storybook later in this guide:

> In order for your storybook to run properly be sure to be either run `ember serve` or `ember build` before running any storybook commands.

```json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -s dist"
  }
}
```

## Setup environment

### Adding preview-head.html

In order for storybook to register your ember application you must add the following file to `.storybook/preview-head.html`

> These scripts may not contain everything you need, a good point of reference is to look at what is in the head tag in your applications `dist/index.html` file when you build.

```
<meta name="{ember-app-name}/config/environment" content="%7B%22modulePrefix%22%3A%22{ember-app-name}%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22auto%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22name%22%3A%22{ember-app-name}%22%2C%22version%22%3A%224.0.0-alpha.23+4f61a2fb%22%7D%7D" />

<link integrity="" rel="stylesheet" href="./assets/vendor.css">
<link integrity="" rel="stylesheet" href="./assets/{ember-app-name}.css">

<script src="./assets/vendor.js"></script>
<script>
  runningTests = true;
</script>
<script src="./assets/{ember-app-name}.js"></script>
```

> Adding the runningTests script is extremely important don't forget to add this as it will result in your application binding multiple times.

Substitute `ember-app-name` with the name of your ember application.

> This is found by going to `package.json` and referencing the name field

### Adding .env

A file named `.env` is needed in the root directory with the following contents:

```
STORYBOOK_NAME={ember-app-name}
```

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
      </button>`
    },
    context: {
      onClick: (e) => console.log(e)
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
