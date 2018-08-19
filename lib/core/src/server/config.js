import path from 'path';
import findCacheDir from 'find-cache-dir';
import { logger } from '@storybook/node-logger';
import { createDefaultWebpackConfig } from './config/defaults/webpack.config';
import loadCustomWebpackConfig from './loadCustomWebpackConfig';
import loadPresets from './presets';
import mergeConfigs from './mergeConfigs';
import serverRequire from './serverRequire';

const noopWrapper = config => config;

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

function customPreset({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));
  return loadPresets(presets);
}

function getBabelConfig(options, corePresets, frameworkPresets, customPresets) {
  const { configDir, wrapDefaultBabelConfig = noopWrapper } = options;

  const coreBabelConfig = corePresets.extendBabel({}, { configDir, wrapDefaultBabelConfig });
  const frameworkBabelConfig = frameworkPresets.extendBabel(coreBabelConfig);
  const babelConfig = customPresets.extendBabel(frameworkBabelConfig);

  return {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables a cache directory for faster-rebuilds
    // `find-cache-dir` will create the cache directory under the node_modules directory.
    cacheDirectory: findCacheDir({ name: 'react-storybook' }),
    ...babelConfig,
  };
}

function getWebpackConfig(options, babelOptions, corePresets, frameworkPresets, customPresets) {
  const { configType, configDir, defaultConfigName } = options;

  const coreConfig = corePresets.extendWebpack(
    {},
    { ...options, babelOptions, presets: customPresets }
  ); // core presets
  const frameworkConfig = frameworkPresets.extendWebpack(coreConfig, { configDir }); // framework presets
  const config = customPresets.extendWebpack(frameworkConfig); // custom presets

  const defaultConfig = createDefaultWebpackConfig(config);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    informAboutCustomConfig(defaultConfigName);
    return defaultConfig;
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(config, configType, defaultConfig);
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  return mergeConfigs(config, customConfig);
}

export default options => {
  const { corePresets, frameworkPresets, ...restOptions } = options;

  const loadedCorePresets = loadPresets(corePresets);
  const loadedFrameworkPresets = loadPresets(frameworkPresets);
  const loadedCustomPresets = customPreset(options);

  const babelOptions = getBabelConfig(
    restOptions,
    loadedCorePresets,
    loadedFrameworkPresets,
    loadedCustomPresets
  );

  return getWebpackConfig(
    restOptions,
    babelOptions,
    loadedCorePresets,
    loadedFrameworkPresets,
    loadedCustomPresets
  );
};
