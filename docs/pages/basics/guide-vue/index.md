---
id: 'guide-vue'
title: 'Storybook for Vue'
---

You may have tried to use our quick start guide to setup your project for Storybook. If you want to set up Storybook manually, this is the guide for you.

> This will also help you to understand how Storybook works.

## Starter Guide Vue

Storybook has its own Webpack setup and a dev server.  
Webpack setup is very similar to [Vue CLI](https://github.com/vuejs/vue-cli), but allows you to [configure as you want](/configurations/custom-webpack-config/).

In this guide, we are trying to set up Storybook for your Vue project.

## Table of contents

-   [Add @storybook/vue](#add-storybookvue)
-   [Add vue](#add-vue)
-   [Create the config file](#create-the-config-file)
-   [Write your stories](#write-your-stories)
-   [Run your Storybook](#run-your-storybook)

## Add @storybook/vue

First of all, you need to add `@storybook/vue` to your project. To do that, simply run:

```sh
npm i --save-dev @storybook/vue
```

## Add vue

Make sure that you have `vue` in your dependencies as well because we list is as a peerDependency:

```sh
npm i --save vue
```

## Create the config file

Storybook can be configured in several different ways. 
That’s why we need a config directory. We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory.

There's 3 things you need to tell Storybook to do:

1.  In stories, if use the custom components without Vue `components` option, you need to register these with `Vue.component`.
2.  In stories, if use the Vue plugins (e.g. `vuex`), you need to install these with `Vue.use`.
3.  Require your stories.

To do that, simply create a file at `.storybook/config.js` with the following content:

```js
import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins

// Import your custom components.
import Mybutton from '../src/stories/Button.vue';

// Install Vue plugins.
Vue.use(Vuex);

// Register custom components.
Vue.component('my-button', Mybutton);

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);
```

That'll register all your custom components, install all Vue plugins and load stories in `../stories/index.js`.

All custom components and All Vue plugins should be registered before calling `configure`.

> This stories folder is just an example, you can load stories from wherever you want to.
> We think stories are best located close to the source files.

## Write your stories

Now you can write some stories inside the `../stories/index.js` file, like this:

```js
import Vue from 'vue';

import { storiesOf } from '@storybook/vue';

import MyButton from './Button.vue';

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
