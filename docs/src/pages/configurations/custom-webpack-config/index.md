---
id: 'custom-webpack-config'
title: 'Custom Webpack Config'
---

You can customize Storybook's webpack setup by providing a `webpack.config.js` file exporting a **webpack 4** compatible config exported as a **commonjs module**.

The file can export an object or a function. The former configures in [extend mode](#extend-mode), the latter in [full control mode](#full-control-mode), both described here.

## Extend Mode

If your file exports an **object**, it puts Storybook into **extend-mode**.

Extend-mode _merges_ the exported object with Storybook's [default webpack configuration](../default-config/) which supports a bunch of common file types. The [merge operation](https://github.com/storybooks/storybook/blob/next/lib/core/src/server/utils/merge-webpack-config.js) appends webpack arrays like `rules` and `plugins` and merges objects like `optimization`.

For example, to add [SASS](http://sass-lang.com/) support to Storybook, install `style-loader`, `css-loader`, `sass-loader`, and `node-sass` and add the following snippet to `.storybook/webpack.config.js`:

```js
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      },
    ],
  },
};
```

If you're using a non-standard Storybook config directory, you should put `webpack.config.js` there instead of `.storybook` and update the `include` path to make sure that it resolves to your project root.

You can add any kind of webpack configuration options with the above config, whether they are plugins, loaders, or aliases.
But you won't be able to change the following config options:

- entry
- output
- js loader with babel

For the advanced usage we strongly recommend [full control mode](#full-control-mode).

## Full Control Mode

If your file exports a **function**, it puts Storybook into **full-control-mode**.

Storybook will call the function with an object containing `config` and `mode` fields. `config` is Storybook's default configuration, and `mode` allows you to create different configurations for dev and production environments.

For example, here's a `webpack.config.js` to add [SASS](http://sass-lang.com/) support using full-control-mode:

```js
const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });

  // Return the altered config
  return config;
};
```

Storybook uses the config returned from the above function. So edit `config` with care. Make sure to preserve the following config options:

- entry
- output
- first loader in the module.loaders (Babel loader for JS)
- all existing plugins

> If your custom webpack config uses a loader that does not explicitly include specific file extensions via the `test` property, it is necessary to `exclude` the `.ejs` file extension from that loader.

## Using Your Existing Config

If you have an existing webpack config for your project and want to reuse this app's configuration, you can either:

- Import your main webpack config into Storybook's `webpack.config.js` and use the loaders and plugins used in that.
- Create a new file with common webpack options and use it in both inside the main webpack config and inside Storybook's `webpack.config.js`.
