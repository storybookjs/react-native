# API

You can configure React Storybook in different ways. We'll discuss them here.

## TOC

* [Command Line API](#command-line-api)
  * [Port](#port)
  * [Static Directory](#static-directory)
  * [Configuration Directory](#configuration-directory)
  * [Static Builder](#static-builder)
* [Story Creation API](#story-creation-api)
  * [Creating Stories](#creating-stories)
  * [Creating Actions](#creating-actions)
  * [Linking Stories](#linking-stories)
* [Basic Configurations](#basic-configurations)
  * [Loading Modules](#loading-modules)
  * [Load Common CSS Files](#load-common-css-files)
  * [Configure Modules for Testing](#configure-modules-for-testing)
* [Custom Webpack Configurations](#custom-webpack-configurations)
* [Load Custom HTML Head](#load-custom-html-head)

## Command Line API

React Storybook comes with a command line API, which you usually use inside a NPM script. Here's the options it has:

### Port

You must set a port on which React Storybook starts its web server. Here's how to specify it:

```sh
start-storybook -p 6977
```

### Static Directory

Sometimes, you ship your static files directly inside your project. In Meteor apps, this is done with the `public` directory in the app root. So, you can ask React Storybook to serve those static files.

Here's how to tell React Storybook to use that directory to load static files:

```sh
start-storybook -p 6977 -s ./public
```

### Configuration Directory

React Storybook uses `.storybook` directory as a default location for its [basic](#basic-configurations) and [custom webpack](#custom-webpack-configurations) configuration.

Here's how to tell React Storybook to use a custom directory to load your configuration files:

```sh
start-storybook -p 6977 -s ./public -c ./storybook-config
```

### Static Builder

With Static Builder, you could convert your whole Storybook into a static site. Then, you can deploy that into any static site hosting service including "GitHub Pages".

Add following script as an NPM script:

```sh
build-storybook -o storybook-build-dir
```

Then it'll build and save a set of static files into the `storybook-build-dir` directory. You can access them by running a following python static server:

```python
python -m SimpleHTTPServer
```

For more information, run `build-storybook -h`.

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

Here you can chain the `add` method and create as many stories as you need.

### Creating Actions

Usually, our components accept event handlers. Actions help us to debug those event handlers. These actions are logged in the `Action Logger` info window in React Storybook.

This is how we can create an action:

```js
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Button', module)
  .add('with a text', () => (
    <button onClick={action('click the button')}>My First Button</button>
  ));
```

Here we create an action named `click the button`. It gives a function to the `onClick` prop in our button.

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

Here we can see the name we've mentioned when creating the action. After that, we can see the arguments passed to the `onClick` event handler. In this case, we've three arguments. `[SyntheticMouseEvent]` is the actual event object passed by React and you can use that to get more details.

> For simplicity, React Storybook does not show the actual object. Instead it will show `[SyntheticMouseEvent]`.

### Linking Stories

Sometimes, we may need to link stories. With that, we could use Storybook as a prototype builder. (like [InVision](https://www.invisionapp.com/), [Framer.js](http://framerjs.com/)). Here's how to do that.

Let's say, we've a Toggle button and we need to change the story as we click the button. This is how we do it:

```js
import { linkTo } from @kadira/storybook

storiesOf('Toggle', module)
  .add('on', () => {
    return <Toggle value={true} onChange={linkTo('Toggle', 'off')} />
  })
  .add('off', () => {
    return <Toggle value={false} onChange={linkTo('Toggle', 'on')} />
  });
```

Have a look at the `linkTo` function:

```js
linkTo('Toggle', 'off')
```

With that, you can link an event prop to any story in the Storybook.

* First parameter is the the story kind name (what you named with `storiesOf`).
* Second parameter is the story name (what you named with `.add`).

> You can also pass a function instead for any of above parameter. That function accepts arguments emitted by the event and it should return a string.

Have a look at [PR86](https://github.com/kadirahq/react-storybook/pull/86) for more information.

## Basic Configurations

React Storybook uses a JavaScript file located at `.storybook/config.js` as the entry point. This is the file loaded by webpack when it's initializing. You can configure a few things inside it.

### Loading Modules

Loading modules is the main task of this configuration file. You can do so like this:

```js
import { configure } from '@kadira/storybook';

function loadStories() {
  require('../components/stories/button');
  // require as many stories as you need.
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

Sometimes your app has some common CSS files, so this is the best place to load them. In our [Redux to-do example](https://github.com/kadira-samples/react-storybook-demo), we load todomvc CSS like this:

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

In some of our apps we use [`react-komposer`](https://github.com/kadirahq/react-komposer) (especially in Mantra apps). So, if you use any container created by `react-komposer`, it usually throws an error since React Storybook does not initialize them properly.

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

## Custom Webpack Configurations

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

### Customizing The UI

You can customize the UI by duplicating the original components such as  [layout.js](https://raw.githubusercontent.com/kadirahq/react-storybook/master/src/client/ui/layout.js) file, put it in `.storybook/layout.js` and setting webpack config like this :

```js
const path = require('path');

module.exports = {
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\.\/layout$/, 'custom-layout')
  ],
  resolve: {
    alias: {
      'custom-layout': path.resolve('.storybook/layout.js')
    }
  }
}
```

> You can pass options to this config file as you wish. But, there are some stuff like devServer we'll always add by default. <br/>
> So, usually you need to use this config for doing following things:
>  *  for loading CSS,
>  *  for adding custom resolve extensions,
>  *  for adding resolve aliases.

## Load Custom HTML Head

Sometimes, we need to load custom DOM nodes inside the HTML `<head>` tag. For an example, this is how we can load TypeKit fonts with React Storybook.

First create a file called `head.html` inside the storybook config directory. Then add following content:

```js
<script src="https://use.typekit.net/xxxyyy.js"></script>
<script>try{ Typekit.load(); }catch(e){}</script>
```

Then run the `npm run storybook` command again. That's it.

> Likewise, you can add anything into the HTML head.
