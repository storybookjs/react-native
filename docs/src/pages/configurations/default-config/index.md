---
id: 'default-config'
title: 'Default Config'
---

Let's learn about the default config comes with Storybook.

## Babel

We use Babel for JavaScript(ES6) transpiling.
Here are some key features of Storybook's Babel configurations.

### ES2016+ Support

We have added ES2016 support with Babel for transpiling your JS code.
In addition to that, we've added a few experimental features, like object spreading and async await.
Check out our [source](https://github.com/storybooks/storybook/blob/master/lib/core/src/server/config/babel.dev.js) to learn more about these plugins.

### .babelrc support

If your project has a `.babelrc` file, we'll use that instead of the default config file.
So, you could use any babel plugins or presets that you have used in your project with Storybook.

## Webpack

We use Webpack to serve and load JavaScript modules for the web.

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


### CSS Support

You can simply import CSS files wherever you want, whether it's in the storybook config file, a UI component, or inside a story definition file.

Basically, you can import CSS like this:

```js
// from NPM modules
import 'bootstrap/dist/css/bootstrap.css';

// from local path
import './styles.css';
```

> **Note:** with some frameworks/clis we inject plain CSS only. If you need a preprocessor like SASS, you need to [customize the webpack config](/configurations/custom-webpack-config/).
>
> **Warning:** storybooks for projects that use Angular CLI cannot import CSS by default. They must either [customize the webpack config](/configurations/custom-webpack-config/), or use the inline loader syntax:
> ```js
> import '!style-loader!css-loader!./styles.css';
> ```

### Image and Static File Support

You can also import images and media files directly via JavaScript.
This helps you to write stories with media files easily. This is how to do it:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

import imageFile from './static/image.png';

storiesOf('<img />', module)
  .add('with a image', () => (
    <img src={imageFile} alt="covfefe" />
  ));
```

When you are building a storybook, we'll also export the imported image.
So, this is a good approach to loading all of your static content.

> **Alternative:** storybook also has a way to mention static directories via the `-s` option of the `start-storybook` and `build-storybook` commands. [read more](/configurations/serving-static-files/)

### JSON Loader

You can import `.json` files, as you do with Node.js.
This will also allow you to use NPM projects, which imports `.json` files inside them.

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

import data from './data.json';

storiesOf('Component', module)
  .add('with data', () => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  ));
```

## NPM Modules

You can use any of the NPM modules installed on your project.
You can simply import and use them.
