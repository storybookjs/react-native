---
id: 'custom-webpack-config'
title: 'Custom Webpack Config'
---

You can customize Storybook's webpack setup by providing a `webpack.config.js` file exporting a **webpack 4** compatible config exported as a **commonjs module**.

Storybook has its own Webpack setup and a dev server.
The webpack config [is configurable](/configurations/custom-webpack-config/), and the default can depend on which framework you're using and whether you've used a generator like [Create React App](https://github.com/facebookincubator/create-react-app) or Angular CLI etc.

> We're trying to make storybook more zero-config over time, **help to hook into the config of generators is very welcome**.

<details>
  <summary>This is what the config for storybook looks like when using CRA in dev-mode:</summary>

```js
{
  mode: 'development',
  bail: false,
  devtool: '#cheap-module-source-map',
  entry: [
    '@storybook/core/dist/server/common/polyfills.js',
    '@storybook/core/dist/server/preview/globals.js',
    '<your-storybook-dir>/config.js',
    'webpack-hot-middleware/client.js?reload=true',
  ],
  output: {
    path: './',
    filename: '[name].[hash].bundle.js',
    publicPath: '',
  },
  plugins: [
    HtmlWebpackPlugin {
      options: {
        template: '@storybook/core/dist/server/templates/index.ejs',
        templateContent: false,
        templateParameters: [Function: templateParameters],
        filename: 'iframe.html',
        hash: false,
        inject: false,
        compile: true,
        favicon: false,
        minify: undefined,
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: 'none',
        meta: {},
        title: 'Webpack App',
        xhtml: false,
        alwaysWriteToDisk: true,
      },
    },
    DefinePlugin {
      definitions: {
        'process.env': {
          NODE_ENV: '"development"',
          NODE_PATH: '""',
          PUBLIC_URL: '"."',
          '<storybook-environment-variables>'
          '<dotenv-environment-variables>'
        },
      },
    },
    WatchMissingNodeModulesPlugin {
      nodeModulesPath: './node_modules',
    },
    HotModuleReplacementPlugin {},
    CaseSensitivePathsPlugin {},
    ProgressPlugin {},
    DefinePlugin {
      definitions: {
        '<storybook-environment-variables>'
        '<dotenv-environment-variables>'
      },
    },
  ],
  module: {
    rules: [
      { test: /\.(mjs|jsx?)$/,
        use: [
          { loader: 'babel-loader', options:
            { cacheDirectory: './node_modules/.cache/storybook',
              presets: [
                [ './node_modules/@babel/preset-env/lib/index.js', { shippedProposals: true, useBuiltIns: 'usage' } ],
                './node_modules/@babel/preset-react/lib/index.js',
                './node_modules/@babel/preset-flow/lib/index.js',
              ],
              plugins: [
                './node_modules/@babel/plugin-proposal-object-rest-spread/lib/index.js',
                './node_modules/@babel/plugin-proposal-class-properties/lib/index.js',
                './node_modules/@babel/plugin-syntax-dynamic-import/lib/index.js',
                [ './node_modules/babel-plugin-emotion/dist/babel-plugin-emotion.cjs.js', { sourceMap: true, autoLabel: true } ],
                './node_modules/babel-plugin-macros/dist/index.js',
                './node_modules/@babel/plugin-transform-react-constant-elements/lib/index.js',
                './node_modules/babel-plugin-add-react-displayname/index.js',
                [ './node_modules/babel-plugin-react-docgen/lib/index.js', { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' } ],
              ],
            },
          },
        ],
        include: [ './' ],
        exclude: [ './node_modules' ],
      },
      { test: /\.md$/,
        use: [
          { loader: './node_modules/raw-loader/index.js' },
        ],
      },
      { test: /\.css$/,
        use: [
          './node_modules/style-loader/index.js',
          { loader: './node_modules/css-loader/dist/cjs.js', options: { importLoaders: 1 } },
          { loader: './node_modules/postcss-loader/src/index.js', options: { ident: 'postcss', postcss: {}, plugins: [Function: plugins] } },
        ],
      },
      { test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
        loader: './node_modules/file-loader/dist/cjs.js',
        query: { name: 'static/media/[name].[hash:8].[ext]' },
      },
      { test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: './node_modules/url-loader/dist/cjs.js',
        query: { limit: 10000, name: 'static/media/[name].[hash:8].[ext]' },
      },
    ],
  },
  resolve: {
    extensions: [ '.mjs', '.js', '.jsx', '.json' ],
    modules: [ 'node_modules' ],
    mainFields: [ 'browser', 'main', 'module' ],
    alias: {
      'core-js': './node_modules/core-js',
      react: './node_modules/react',
      'react-dom': './node_modules/react-dom',
    },
  },
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: true,
    minimizer: [ [Object] ],
  },
  performance: { hints: false },
}
```

</details>

### Debug the default webpack config

  <summary>To effectively customise the webpack config, you might need to get the full default config it's using.</summary>
  
  <div></div>

- Create a `.storybook/webpack.config.js` file.
- Edit it's contents:
  ```js
  module.exports = async ({ config }) => console.dir(config.plugins, { depth: null }) || config;
  ```
- Then run storybook:
  ```sh
  yarn storybook --debug-webpack
  ```

The console should log the entire config, for you to inspect.

## Webpack customisation modes

The file should export a [function](#full-control-mode). In older verions of Storybook you were also able to export an [object](#extend-mode), but this behavior is deprecated and will be removed in 5.x.

### Full Control Mode

If your file exports a **function**, it puts Storybook into **full-control-mode**.

Storybook will call the function with an object containing `config` and `mode` fields. `config` is Storybook's default configuration, and `mode` allows you to create different configurations for dev and production environments.

For example, here's a `webpack.config.js` to add [SASS](http://sass-lang.com/) support using full-control mode:

```js
const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
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

Storybook uses the config returned from the above function to render your components in Storybook's "preview" iframe. Note that Storybook has a completely separate webpack config for its own UI (also referred to as the "manager"), so the customizations you make only applies to the rendering of your stories.

Nevertheless, edit `config` with care. Make sure to preserve the following config options:

- entry
- output

> If your custom webpack config uses a loader that does not explicitly include specific file extensions via the `test` property, it is necessary to `exclude` the `.ejs` file extension from that loader.

### Extend Mode (**Deprecated**)

If your file exports an **object**, it puts Storybook into **extend-mode**. This mode is deprecated and will be removed in a future version.

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

You can add any kind of webpack configuration options with the above config, whether they are plugins, loaders, or aliases. But you won't be able to change the following config options:

- entry
- output

## Using Your Existing Config

If you have an existing webpack config for your project and want to reuse this app's configuration, you can either:

- Import your main webpack config into Storybook's `webpack.config.js` and use the loaders and plugins used in that.
- Create a new file with common webpack options and use it in both inside the main webpack config and inside Storybook's `webpack.config.js`.

**Example**  
_merging the loaders from your app's `webpack.config.js` with storybook's_

```js
const path = require('path');
// your app's webpack.config.js
const custom = require('../webpack.config.js');

module.exports = async ({ config, mode }) => {
  return { ...config, loaders: custom.loaders };
};
```
