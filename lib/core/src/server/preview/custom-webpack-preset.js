import deprecate from 'util-deprecate';
import { stripIndents } from 'common-tags';
import { logger } from '@storybook/node-logger';
import loadCustomWebpackConfig from '../utils/load-custom-webpack-config';
import mergeConfigs from '../utils/merge-webpack-config';
import { createDefaultWebpackConfig } from './base-webpack.config';

async function createFinalDefaultConfig(presets, config, options) {
  const defaultConfig = createDefaultWebpackConfig(config);
  return presets.apply('webpackFinal', defaultConfig, options);
}

export async function webpack(config, options) {
  const { configDir, configType, presets, webpackConfig } = options;

  // through standalone webpackConfig option
  if (webpackConfig) {
    const finalDefaultConfig = await createFinalDefaultConfig(presets, config, options);
    return webpackConfig(finalDefaultConfig);
  }

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  if (customConfig === null) {
    logger.info('=> Using default Webpack setup.');
    return createFinalDefaultConfig(presets, config, options);
  }

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom Webpack config (full-control mode).');
    const finalDefaultConfig = await createFinalDefaultConfig(presets, config, options);
    return customConfig({ config: finalDefaultConfig, mode: configType });
  }

  logger.info('=> Loading custom webpack config (extending mode).');

  // Restore 4.x behavior, but deprecate this mode of extending webpack
  const finalConfig = await presets.apply('webpackFinal', config, options);
  return deprecate(
    () => mergeConfigs(finalConfig, customConfig),
    stripIndents`
      Extend-mode configuration is deprecated, please use full-control mode instead.
      
      See https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode
    `
  )();
}
