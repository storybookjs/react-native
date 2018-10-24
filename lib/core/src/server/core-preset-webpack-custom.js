import { logger } from '@storybook/node-logger';
import loadCustomWebpackConfig from './loadCustomWebpackConfig';
import mergeConfigs from './mergeConfigs';
import { createDefaultWebpackConfig } from './config/webpack.config.iframe.default';

function informAboutCustomConfig(defaultConfigName) {
  if (!defaultConfigName) {
    logger.info('=> Using default webpack setup.');
    return;
  }

  logger.info(`=> Using default webpack setup based on "${defaultConfigName}".`);
}

function wrapPresets(presets) {
  return {
    webpackFinal: async (config, args) => presets.apply('webpackFinal', config, args),
  };
}

async function createFinalDefaultConfig(presets, config, options) {
  const defaultConfig = createDefaultWebpackConfig(config);
  return presets.webpackFinal(defaultConfig, options);
}

export async function webpack(config, options) {
  const { configDir, configType, defaultConfigName } = options;
  const presets = wrapPresets(options.presets);

  const finalConfig = await presets.webpackFinal(config, options);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    informAboutCustomConfig(defaultConfigName);
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
