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

### parser
The parser that will be parsing your code to AST (based on [prettier](https://github.com/prettier/prettier/tree/master/src/language-js))

Alowed values:
* `javascript` - default
* `typescript`
* `flow`

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
            options: { parser: 'typescript' }
          }
        ],
        enforce: 'pre',
      },
    ],
  },
};
```

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

### injectDecorator
Tell storysource whether you need inject decorator.If false, you need to add the decorator by yourself;

Defaults: true

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
            options: { injectDecorator: false }
          }
        ],
        enforce: 'pre',
      },
    ],
  },
};
```
