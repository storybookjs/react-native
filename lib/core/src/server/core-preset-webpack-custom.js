import { logger } from '@storybook/node-logger';
import loadCustomWebpackConfig from './loadCustomWebpackConfig';
import mergeConfigs from './mergeConfigs';
import { createDefaultWebpackConfig } from './config/defaults/webpack.config';

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

function extendWebpack(config, { configDir, configType, defaultConfigName }) {
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

export default {
  extendWebpack,
};
