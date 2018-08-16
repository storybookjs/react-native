import findCacheDir from 'find-cache-dir';
import { logger } from '@storybook/node-logger';
import { createDefaultWebpackConfig } from './config/defaults/webpack.config';
import devBabelConfig from './config/babel';
import loadCustomBabelConfig from './loadCustomBabelConfig';
import loadCustomWebpackConfig from './loadCustomWebpackConfig';
import loadPresets from './presets';
import mergeConfigs from './mergeConfigs';

const noopWrapper = config => config;

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

function getBabelConfig(options, presets) {
  const {
    configDir,
    defaultBabelConfig = devBabelConfig,
    wrapDefaultBabelConfig = noopWrapper,
    wrapBabelConfig = noopWrapper,
  } = options;

  const defaultConfig = wrapDefaultBabelConfig(defaultBabelConfig);
  const customBabelConfig = loadCustomBabelConfig(configDir, defaultConfig);
  const frameworkBabelConfig = wrapBabelConfig(customBabelConfig);
  const presetBabelConfig = presets.extendBabel(frameworkBabelConfig);

  return {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables a cache directory for faster-rebuilds
    // `find-cache-dir` will create the cache directory under the node_modules directory.
    cacheDirectory: findCacheDir({ name: 'react-storybook' }),
    ...presetBabelConfig,
  };
}

function getWebpackConfig(options, babelOptions, presets) {
  const {
    configType,
    getBaseConfig,
    configDir,
    defaultConfigName,
    wrapInitialConfig = noopWrapper,
    wrapBasicConfig = noopWrapper,
    wrapDefaultConfig = noopWrapper,
  } = options;

  const baseConfig = getBaseConfig({ ...options, babelOptions, presets });
  const initialConfig = wrapInitialConfig(baseConfig, configDir);
  const config = presets.extendWebpack(initialConfig);
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
}

export default options => {
  const { configDir } = options;

  const presets = loadPresets(configDir);
  const babelOptions = getBabelConfig(options, presets);
  return getWebpackConfig(options, babelOptions, presets);
};
