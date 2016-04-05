# API

You can configure React Storybook in different ways. We'll discuss them here.

## TOC

* [Command Line API](#command-line-api)
  * [Port](#port)
  * [Static Directory](#static-directory)
  * [Configuration Directory](#configuration-directory)
* [Story Creation API](#story-creation-api)
  * [Creating Stories](#creating-stories)
  * [Creating Actions](#creating-actions)
* [Basic Configurations](#basic-configurations)
  * [Loading Modules](#loading-modules)
  * [Load Common CSS Files](#load-common-css-files)
  * [Configure Modules for Testing](#configure-modules-for-testing)
* [Custom webpack Configurations](#custom-webpack-configurations)

## Command Line API

React Storybook comes with a command line API, which you usually use inside a NPM script. Here's the options it has:

### Port

You must set a port where the React Storybook starts it's web server. Here's how to specify it:

```
start-storybook -p 6977
```

### Static Directory

Sometimes, you ship your static files directly inside your project. In Meteor apps, this is done with the `public` directory in the app root. So, you can ask React Storybook to serve those static files.

Here's how to tell React Storybook to use that directory to load static files:

```
start-storybook -p 6977 -s ./public
```

### Configuration Directory

React Storybook uses `.storybook` directory as a default location for its [basic](#basic-configurations) and [custom webpack](#custom-webpack-configurations) configuration.

Here's how to tell React Storybook to use a custom directory to load your configuration files:

```
start-storybook -p 6977 -s ./public -c ./storybook-config
```

## Story Creation API

We need to create stories to show your components inside React Storybook. For that, we need to use this API.

### Creating Stories

This is how you can create stories:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';

storiesOf('Button', module)
  .add('with a text', () => (
    <button>My First Button</button>
  ))
  .add('with no text', () => (
    <button></button>
  ));
```

Here you can chain the `add` method and create as many as stories as you need.

### Creating Actions

Usually, our components accept event handlers. Actions help us to debug those event handlers. These actions are logged in the `Action Logger` in React Storybook.

This is how we can create an action:

```js
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Button', module)
  .add('with a text', () => (
    <button onClick={action('click the button')}>My First Button</button>
  ));
```

Here we create an action named `clicked`. It gives a function to the onClick prop in our button.

Then, when you click on the button, it will log something like this into the Action Logger:

```js
{
  "name": "click the button",
  "args": [
    "[SyntheticMouseEvent]",
    ".1",
    {
      "isTrusted": false
    }
  ]
}
```

Here we can see the name we've mentioned when creating the action. After that, we can see the arguments passed to the event handler onClick. In this case, we've three arguments. `[SyntheticMouseEvent]` is the actual event object passed by React and you can use that to get more details.

> For simplicity, React Storybook does not show the actual object. Instead it will show `[SyntheticMouseEvent]`.

## Basic Configurations

React Storybook uses a JavaScript file at `.storybook/config.js` as the entry point. This is the file loaded by webpack when it's initializing. You can configure a few things inside it.

### Loading Modules

Loading modules is the main task of this configuration file. You can do so like this:

```js
import { configure } from '@kadira/storybook';

function loadStories() {
  require('../components/stories/button');
  // require as many as stories you need.
}

configure(loadStories, module);
```

Or, if you prefer to keep your stories close to your components, and use a convention to name them (i.e. `buttonStory.js`), you can require them like this:

```js
import { configure } from '@kadira/storybook';

const req = require.context('./', true, /Story\.js$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);
```

### Load Common CSS Files

Sometimes your app has some common CSS files, so this is the best place to load them. In our Redux to-do example, we load todomvc CSS like this:

```js
import { configure } from '@kadira/storybook';
import 'todomvc-app-css/index.css'

function loadStories() {
  ...
}

configure(loadStories, module);
```

### Configure Modules for Testing

React Storybook is not your app. So, sometimes you won’t be able to use some of the APIs and functionalities inside it. So, you need to turn them off or do something else.

Let's have a look at an example.

In some of our apps, we use [`react-komposer`](https://github.com/kadirahq/react-komposer) (especially in Mantra apps). So, if you use any container created by `react-komposer`, it usually throws an error since React Storybook does not initialize them properly.

In such a scenario, you can disable `react-komposer` like this:

```js
import { configure } from '@kadira/storybook';
import { disable } from 'react-komposer';

disable();

function loadStories() {
  ...
}

configure(loadStories, module);
```

## Custom webpack Configurations

React Storybook is built on top of webpack. If you need, you can customize the webpack configurations used by React Storybook.

We usually use this feature to add CSS support.

To do so, you need to create a file at `.storybook/webpack.config.js` and export a module like this:

```js
const path = require('path');

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    loaders: [
      {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}
```

> Usually, there are a lot of things we can do with webpack, but React Storybook allows you to add only custom loaders and plugins.
