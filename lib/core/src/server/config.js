import findCacheDir from 'find-cache-dir';
import { logger } from '@storybook/node-logger';
import { createDefaultWebpackConfig } from './config/defaults/webpack.config';
import devBabelConfig from './config/babel';
import loadCustomBabelConfig from './loadCustomBabelConfig';
import loadCustomWebpackConfig from './loadCustomWebpackConfig';

const noopWrapper = config => config;

function getBabelConfig({
  configDir,
  defaultBabelConfig = devBabelConfig,
  wrapDefaultBabelConfig = noopWrapper,
  wrapBabelConfig = noopWrapper,
}) {
  const defaultConfig = wrapDefaultBabelConfig(defaultBabelConfig);
  return wrapBabelConfig(loadCustomBabelConfig(configDir, defaultConfig));
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

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

// `baseConfig` is a webpack configuration bundled with storybook.
// Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.
export default options => {
  const {
    configType,
    getBaseConfig,
    configDir,
    defaultConfigName,
    wrapInitialConfig = noopWrapper,
    wrapBasicConfig = noopWrapper,
    wrapDefaultConfig = noopWrapper,
  } = options;

  const babelOptions = {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables a cache directory for faster-rebuilds
    // `find-cache-dir` will create the cache directory under the node_modules directory.
    cacheDirectory: findCacheDir({ name: 'react-storybook' }),
    ...getBabelConfig(options),
  };
  const baseConfig = getBaseConfig({ ...options, babelOptions });
  const config = wrapInitialConfig(baseConfig, configDir);

  const defaultConfig = wrapDefaultConfig(createDefaultWebpackConfig(config));

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    informAboutCustomConfig(defaultConfigName);
    return defaultConfig;
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(wrapBasicConfig(config), configType, defaultConfig);
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  return mergeConfigs(config, customConfig);
};
