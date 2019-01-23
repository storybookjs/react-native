import { logger } from '@storybook/node-logger';
import loadCustomWebpackConfig from '../utils/load-custom-webpack-config';
import mergeConfigs from '../utils/merge-webpack-config';
import { createDefaultWebpackConfig } from './base-webpack.config';

async function createFinalDefaultConfig(presets, config, options) {
  const defaultConfig = createDefaultWebpackConfig(config);
  return presets.apply('webpackFinal', defaultConfig, options);
}

export async function webpack(config, options) {
  const { configDir, configType, presets } = options;

  const finalDefaultConfig = await createFinalDefaultConfig(presets, config, options);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    logger.info('=> Using default webpack setup.');
    return finalDefaultConfig;
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig({ config: finalDefaultConfig, mode: configType });
  }

  logger.info('=> Loading custom webpack config (extending mode).');
  return mergeConfigs(finalDefaultConfig, customConfig);
}
