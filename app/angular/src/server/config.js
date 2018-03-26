/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import { logger } from '@storybook/node-logger';
import { createDefaultWebpackConfig } from '@storybook/core/server';
import loadBabelConfig from './babel_config';
import loadTsConfig from './ts_config';
import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';

// `baseConfig` is a webpack configuration bundled with storybook.
// Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.
export default function(configType, baseConfig, configDir) {
  const config = baseConfig;

  const babelConfig = loadBabelConfig(configDir);
  config.module.rules[0].query = babelConfig;

  const tsOptions = loadTsConfig(configDir);
  config.module.rules[1].loaders[0].options = tsOptions;

  // Check whether a config.js file exists inside the storybook
  // config directory and throw an error if it's not.
  const storybookConfigPath = path.resolve(configDir, 'config.js');
  if (!fs.existsSync(storybookConfigPath)) {
    const err = new Error(`=> Create a storybook config file in "${configDir}/config.js".`);
    throw err;
  }
  config.entry.preview.push(require.resolve(storybookConfigPath));

  // Check whether addons.js file exists inside the storybook.
  // Load the default addons.js file if it's missing.
  const storybookCustomAddonsPath = path.resolve(configDir, 'addons.js');
  if (fs.existsSync(storybookCustomAddonsPath)) {
    logger.info('=> Loading custom addons config.');
    config.entry.manager.unshift(storybookCustomAddonsPath);
  }

  // Check whether project has Angular CLI configuration file
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(process.cwd());
  if (cliWebpackConfigOptions) {
    logger.info('=> Loading angular-cli config.');
  }

  const defaultConfig = applyAngularCliWebpackConfig(
    createDefaultWebpackConfig(config),
    cliWebpackConfigOptions
  );

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfigPath = path.resolve(configDir, 'webpack.config.js');

  if (!fs.existsSync(customConfigPath)) {
    logger.info('=> Using default webpack setup based on "angular-cli".');
    return defaultConfig;
  }
  const customConfig = require(customConfigPath);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(
      applyAngularCliWebpackConfig(config, cliWebpackConfigOptions),
      configType,
      defaultConfig
    );
  }
  logger.info('=> Loading custom webpack config (extending mode).');

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
      rules: [...config.module.rules, ...(customConfig.module.rules || [])],
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
