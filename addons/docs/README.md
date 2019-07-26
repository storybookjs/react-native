# Storybook Docs

Living documentation for your components.

- [Sneak peak article](https://medium.com/storybookjs/storybook-docs-sneak-peak-5be78445094a)
- [Technical preview guide](https://docs.google.com/document/d/1un6YX7xDKEKl5-MVb-egnOYN8dynb5Hf7mq0hipk8JE/edit?usp=sharing)

## View layer support

Docs supports all view layers that Storybook supports except for React Native (currently). There are some view-layer specific
features as well. This chart captures the current state of support

|                | React | Vue | Angular | Polymer | Mithril | HTML | Marko | Svelte | Riot | Ember | Preact |
| -------------- | :---: | :-: | :-----: | :-----: | :-----: | :--: | :---: | :----: | :--: | :---: | :----: |
| MDX stories    |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Module stories |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Legacy stories |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Source         |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Notes / Info   |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Props table    |   +   |  +  |    #    |         |         |      |       |        |      |       |        |
| Docgen         |   +   |  +  |    #    |         |         |      |       |        |      |       |        |
| Inline stories |   +   |  #  |         |         |         |      |       |        |      |       |        |

**Notes:**

- `#` denotes planned/WIP support

## Installation

First add the package. Make sure that the versions for your `@storybook/*` packages match:

```sh
yarn add -D @storybook/addon-docs
```

The add the following to your `.storybook/presets.js` exports:

```js
module.exports = ['@storybook/addon-docs/common/preset'];
```

Finally, update your Storybook configuration `.storybook/config.js`. Add `DocsPage` to auto-generate docs for your existing stories, and load MDX files.

```js
import { load, addDecorator } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs/blocks';

addDecorator({ docs: DocsPage });

// wherever your story files are located
load(require.context('../src', true, /\.stories\.(js|ts|tsx|mdx)$/), module);
```

## Preset options

The `addon-docs` preset has a few configuration options that can be used to configure its babel/webpack loading behavior. Here's an example of how to use the preset with options:

```js
module.exports = [
  {
    name: '@storybook/addon-docs/common/preset',
    options: {
      configureJSX: true,
      babelOptions: {},
      sourceLoaderOptions: null,
    },
  },
];
```

The `configureJsx` option is useful when you're writing your docs in MDX and your project's babel config isn't already set up to handle JSX files. `babelOptions` is a way to further configure the babel processor when you're using `configureJSX`.

`sourceLoaderOptions` is an object for configuring `@storybook/source-loader`. When set to `null` it tells docs not to run the `source-loader` at all, which can be used as an optimization, or if you're already using `source-loader` in your `webpack.config.js`.

## Manual configuration

If you don't want to use the preset, and prefer to configure "the long way", first register the addon in `.storybook/addons.js`:

```js
import '@storybook/addon-docs/register';
```

Then configure Storybook's webpack loader in `.storybook/webpack.config.js` to understand MDX story files and annotate TS/JS story files with source code using `source-loader`:

```js
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(stories|story)\.mdx$/,
    use: [
      {
        loader: 'babel-loader',
        // may or may not need this line depending on your app's setup
        plugins: ['@babel/plugin-transform-react-jsx'],
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})],
        },
      },
    ],
  });
  config.module.rules.push({
    test: /\.(stories|story)\.[tj]sx?$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre',
  });
  return config;
};
```
