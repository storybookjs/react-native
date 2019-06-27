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
| Source \*      |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Notes / Info   |   +   |  +  |    +    |    +    |    +    |  +   |   +   |   +    |  +   |   +   |   +    |
| Props table    |   +   |  #  |    #    |         |         |      |       |        |      |       |        |
| Docgen         |   +   |  #  |    #    |         |         |      |       |        |      |       |        |
| Inline stories |   +   |  #  |         |         |         |      |       |        |      |       |        |

**Notes:**

- `#` denotes planned/WIP support
- \* Source supports legacy `JS storiesOf` and `MDX` stories. `Typescript` and new `module format` support is WIP

## Installation

First add the package. Make sure that the versions for your `@storybook/*` packages match:

```sh
yarn add -D @storybook/addon-docs
```

The add the following line to your `.storybook/presets.js` file:

```js
module.exports = ['@storybook/addon-docs/react/preset'];
```

Finally, import your stories and MDX files in `.storybook/config.js`:

```js
import { load } from '@storybook/react';

// standard configuration here
// ...

// wherever your story files are located
load(require.context('../src', true, /\.stories\.js$/), module);
load(require.context('../src', true, /\.stories\.mdx$/), module);
```

## Manual configuration

Docs uses Storybook presets as a configuration shortcut. To configure "the long way", first register the addon in `.storybook/addons.js`:

```js
import '@storybook/addon-docs/register';
```

Then configure Storybook's webpack loader to understand MDX files in `.storybook/webpack.config.js`:

```js
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.mdx$/,
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
  return config;
};
```
