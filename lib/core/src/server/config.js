/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import findCacheDir from 'find-cache-dir';
import { logger } from '@storybook/node-logger';
import { createDefaultWebpackConfig } from './config/defaults/webpack.config';
import loadBabelConfig from './babel_config';

const noopWrapper = config => config;

function setBabelLoaderOptions(config, configDir, defaultBabelConfig, wrapBabelConfig) {
  const jsRule = config.module.rules[0];

  const babelConfig = wrapBabelConfig(loadBabelConfig(configDir, defaultBabelConfig));

  jsRule.query = {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables a cache directory for faster-rebuilds
    // `find-cache-dir` will create the cache directory under the node_modules directory.
    cacheDirectory: findCacheDir({ name: 'react-storybook' }),
    ...babelConfig,
  };
}

function setConfigJsToEntry(config, configDir) {
  // Check whether a config.js file exists inside the storybook
  // config directory and throw an error if it's not.
  const storybookConfigPath = path.resolve(configDir, 'config.js');
  if (!fs.existsSync(storybookConfigPath)) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.js".`);
  }

  config.entry.preview.push(require.resolve(storybookConfigPath));
}

function setAddonsJsToEntry(config, configDir) {
  // Check whether addons.js file exists inside the storybook.
  const storybookCustomAddonsPath = path.resolve(configDir, 'addons.js');
  if (fs.existsSync(storybookCustomAddonsPath)) {
    logger.info('=> Loading custom addons config.');
    config.entry.manager.unshift(storybookCustomAddonsPath);
  }
}

function mergeConfigs(config, customConfig) {
  return {
    ...customConfig,
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...config,
    // Override with custom devtool if provided
    devtool: customConfig.devtool || config.devtool,
    // We need to use our and custom plugins.
    plugins: [...config.plugins, ...(customConfig.plugins || [])],
    module: {
      ...config.module,
      // We need to use our and custom rules.
      ...customConfig.module,
      rules: [
        ...config.module.rules,
        ...((customConfig.module && customConfig.module.rules) || []),
      ],
    },
    resolve: {
      ...config.resolve,
      ...customConfig.resolve,
      alias: {
        ...config.alias,
        ...(customConfig.resolve && customConfig.resolve.alias),
      },
    },
  };
}

// `baseConfig` is a webpack configuration bundled with storybook.
// Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.
export default options => (configType, baseConfig, configDir) => {
  const {
    defaultConfigName,
    defaultBabelConfig,
    wrapBabelConfig = noopWrapper,
    wrapInitialConfig = noopWrapper,
    wrapBasicConfig = noopWrapper,
    wrapDefaultConfig = noopWrapper,
  } = options;

  const config = wrapInitialConfig(baseConfig, configDir);

  setBabelLoaderOptions(config, configDir, defaultBabelConfig, wrapBabelConfig);
  setConfigJsToEntry(config, configDir);
  setAddonsJsToEntry(config, configDir);

  const defaultConfig = wrapDefaultConfig(createDefaultWebpackConfig(config));

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfigPath = path.resolve(configDir, 'webpack.config.js');

  if (!fs.existsSync(customConfigPath)) {
    logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
    return defaultConfig;
  }

  const customConfig = require(customConfigPath);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(wrapBasicConfig(config), configType, defaultConfig);
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  return mergeConfigs(config, customConfig);
};
