# Configure Storybook

You can configure React Storybook in different ways. We'll discuss them here.

## TOC

* [Basic Configurations](#basic-configurations)
  * [Loading Modules](#loading-modules)
  * [Load Common CSS Files](#load-common-css-files)
  * [Configure Modules for Testing](#configure-modules-for-testing)
* [Command Line API](#command-line-api)
  * [Port](#port)
  * [Static Directory](#static-directory)
  * [Configuration Directory](#configuration-directory)
  * [Static Builder](#static-builder)
* [Custom Webpack Configurations](#custom-webpack-configurations)
  * [Add Custom CSS Loaders](#add-custom-css-loaders)
  * [Customizing The UI](#customizing-the-ui)
  * [Other Configurations](#other-configurations)
* [Load Custom HTML Head Content](#load-custom-html-head-content)


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

## Custom Webpack Configurations

React Storybook is built on top of Webpack. If you need, you can customize the Webpack configurations used by React Storybook.

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

### Add Custom CSS Loaders

You can use this custom Webpack configurations to add css loaders. We've a [separate guide](/docs/setting_up_for_css.md) for that.

### Customizing The UI

You can also customize the UI by duplicating the original components such as  [layout.js](https://raw.githubusercontent.com/kadirahq/react-storybook/master/src/client/ui/layout.js) file, put it in `.storybook/layout.js` and setting webpack config like this :

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

### Other Configurations

We allow you to use almost all [Webpack configurations](https://webpack.github.io/docs/configuration.html). So, you can customize as you wish.

## Custom Babel Config

Storybook will first search for a `.babelrc` inside the storybook config directory, and then at your project's root. If it doesn't find either of these files, it will use its default configuration instead.

## Load Custom HTML Head Content

Sometimes, we need to load custom DOM nodes inside the HTML `<head>` tag. For an example, this is how we can load TypeKit fonts with React Storybook.

First create a file called `head.html` inside the storybook config directory. Then add following content:

```js
<script src="https://use.typekit.net/xxxyyy.js"></script>
<script>try{ Typekit.load(); }catch(e){}</script>
```

Then run the `npm run storybook` command again. That's it.

> Likewise, you can add anything into the HTML head.
