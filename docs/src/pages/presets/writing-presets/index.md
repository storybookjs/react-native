---
id: 'writing-presets'
title: 'Writing Presets'
---

[Storybook presets](../introduction/) are grouped collections of `babel`, `webpack`, and `addons` configurations that support specific use cases in Storybook, such as typescript or MDX support.

This doc covers the [presets API](#presets-api) and how to use the presets mechanism for [advanced configuration](#advanced-configuration).

## Presets API

A preset is a set of hooks that is called by Storybook on initialization and can override configurations for `babel`, `webpack`, `addons`, and `entries`.

Each configuration has a similar signature, accepting a base configuration object and options, as in this webpack example:

```js
export async function webpack(baseConfig, options) {
  // Modify or replace config. Mutating the original reference object can cause unexpected bugs,
  // so in this example we replace.
  const { module = {} } = baseConfig;

  return {
    ...baseConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          /* some new loader */
        },
      ],
    },
  };
}
```

### Babel

The babel functions `babel`, `babelDefault`, and `managerBabel` all configure babel in different ways.

All functions take a [Babel configuration object](https://babeljs.io/docs/en/configuration) as their argument and can modify it or return a new object.

For example, Storybook's Vue support uses presets internally and here's how it configures babel:

```js
export function babelDefault(config) {
  return {
    ...config,
    presets: [...config.presets, require.resolve('babel-preset-vue')],
  };
}
```

- `babel` is applied to the preview config, after it has been initialized by storybook
- `babelDefault` is applied to the preview config before any user presets have been applied
- `managerBabel` is applied to the manager.

### Webpack

The webpack functions `webpack`, `webpackFinal`, and `managerWebpack` configure webpack.

All functions take a [webpack4 configuration object](https://webpack.js.org/configuration/).

For example, here is how Storybook automatically adopts `create-react-app`'s configuration if it's installed, where `applyCRAWebpackConfig` is a set of smart heuristics for modifying the input config.

```js
export function webpackFinal(config, { configDir }) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  logger.info('=> Loading create-react-app config.');
  return applyCRAWebpackConfig(config, configDir);
}
```

- `webpack` is applied to the preview config after it has been initialized by storybook
- `webpackFinal` is applied to the preview config after all user presets have been applied
- `webpackManager` is applied to the manager config

### Manager entries

The addon config `managerEntries` allows you to add addons to Storybook from within a preset. For addons that require custom webpack/babel configuration, it is easier to install the preset, and it will take care of everything.

For example, the Storysource preset contains the following code:

```js
export function managerEntries(entry = []) {
  return [...entry, require.resolve('@storybook/addon-storysource/register')];
}
```

This is equivalent to [registering the addon manually](../../addons/using-addons/) in `main.js`:

```js
module.exports = {
  managerEntries: ['@storybook/addon-storysource/register'],
};
```

### Entries

Entries are the place to register entry points for the preview. For example it could be used to make a basic configure-storybook preset that loads all the `*.stories.js` files into SB, instead of forcing people to copy-paste the same thing everywhere.

## Advanced Configuration

The presets API is also more powerful than the [standard configuration options](../custom-webpack-config/) available in Storybook, so it's also possible to use presets for more advanced configuration without actually publishing a preset yourself.

For example, some users want to configure the webpack for Storybook's UI and addons ([issue](https://github.com/storybookjs/storybook/issues/4995)), but this is not possible using [standard webpack configuration](../custom-webpack-config/) (it used to be possible before SB4.1). However, you can achieve this with a private preset.

If it doesn't exists yet, create a file `.storybook/main.js`:

```js
module.exports = {
  managerWebpack: async (config, options) => {
    // update config here
    return config;
  },
  managerBabel: async (config, options) => {
    // update config here
    return config;
  },
  webpack: async (config, options) => {
    return config;
  },
  babel: async (config, options) => {
    return config;
  },
  addons: [],
};
```

## Sharing advanced configuration

Change your `main.js` file to:

```js
const path = require('path');

module.exports = {
  presets: [path.resolve('./.storybook/my-preset')],
};
```

and extract the configuration to a new file `./storybook/my-preset.js`:

```js
module.exports = {
  managerWebpack: async (config, options) => {
    // update config here
    return config;
  },
  managerBabel: async (config, options) => {
    // update config here
    return config;
  },
  webpack: async (config, options) => {
    return config;
  },
  babel: async (config, options) => {
    return config;
  },
  addons: [],
};
```

Place your `my-preset.js` file where ever you want, if you want to share if far and wide you'll want to make it it's own package.
