import { logger } from '@storybook/node-logger';
import loadCustomWebpackConfig from '../utils/load-custom-webpack-config';
import mergeConfigs from '../utils/merge-webpack-config';
import { createDefaultWebpackConfig } from './base-webpack.config';

function logConfigName(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
  } else {
    logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
  }
}

async function createFinalDefaultConfig(presets, config, options) {
  const defaultConfig = createDefaultWebpackConfig(config);
  return presets.apply('webpackFinal', defaultConfig, options);
}

export async function webpack(config, options) {
  const { configDir, configType, defaultConfigName, presets } = options;

  const finalConfig = await presets.apply('webpackFinal', config, options);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    logConfigName(defaultConfigName);
    return createFinalDefaultConfig(presets, config, options);
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    const finalDefaultConfig = await createFinalDefaultConfig(presets, config, options);
    return customConfig(finalConfig, configType, finalDefaultConfig);
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  return mergeConfigs(finalConfig, customConfig);
}
