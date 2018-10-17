import { logger } from '@storybook/node-logger';
import loadCustomWebpackConfig from './loadCustomWebpackConfig';
import mergeConfigs from './mergeConfigs';
import { createDefaultWebpackConfig } from './config/webpack.config.default';

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

async function webpackDefaultConfigPreset(presets, defaultConfig, options) {
  return presets.apply('webpackDefault', defaultConfig, options);
}

export async function webpack(config, options) {
  const { configDir, configType, defaultConfigName, presets } = options;

  const defaultConfig = createDefaultWebpackConfig(config);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    informAboutCustomConfig(defaultConfigName);
    return webpackDefaultConfigPreset(presets, defaultConfig, options);
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    const webpackDefaultConfig = await webpackDefaultConfigPreset(presets, defaultConfig, options);
    return customConfig(config, configType, webpackDefaultConfig);
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  return mergeConfigs(config, customConfig);
}
