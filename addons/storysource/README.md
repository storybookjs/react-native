# Storybook Storysource Addon

This addon is used to show stories source in the addon panel.

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
