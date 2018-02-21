# Storybook Storysource Addon

This addon is used to show stories source in the addon panel. 

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storysource Demo](demo.gif)

## Getting Started

First, install the addon

```sh
npm install -D @storybook/addon-storysource
```

Add this line to your `addons.js` file

```js
import '@storybook/addon-storysource/register';
```

Use this hook to a custom webpack.config. This will generate a decorator call in every story:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        enforce: 'pre',
      },
    ],
  },
};
```

## Loader Options

The loader can be customized with the following options:

### prettierConfig

The prettier configuration that will be used to format the story source in the addon panel.

Defaults:
```js
{
  printWidth: 120,
  tabWidth: 2,
  bracketSpacing: true,
  trailingComma: 'es5',
  singleQuote: true,
}
```

Usage: 

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.stories\.jsx?$/,
        loaders: [
          {
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
              prettierConfig: {
                printWidth: 80,
                singleQuote: false,
              }
            }
          }
        ],
        enforce: 'pre',
      },
    ],
  },
};
```

### uglyCommentsRegex

The array of regex that is used to remove "ugly" comments.

Defaults:
```js
[/^eslint-.*/, /^global.*/]
```

Usage:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.stories\.jsx?$/,
        loaders: [
          {
            loader: require.resolve('@storybook/addon-storysource/loader'),
            options: {
              uglyCommentsRegex: [
                /^eslint-.*/, 
                /^global.*/,
              ]
            }
          }
        ],
        enforce: 'pre',
      },
    ],
  },
};
```
