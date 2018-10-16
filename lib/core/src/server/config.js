import path from 'path';
import { logger } from '@storybook/node-logger';
import loadPresets from './presets';
import serverRequire from './serverRequire';

function wrapCorePresets(presets) {
  return {
    babel: async (config, args) => presets.apply('babel', config, args),
    webpack: async (config, args) => presets.apply('webpack', config, args),
    webpackFinal: async (config, args) => presets.apply('webpackFinal', config, args),
    preview: async (config, args) => presets.apply('preview', config, args),
    manager: async (config, args) => presets.apply('manager', config, args),
  };
}

function customPreset({ configDir }) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));

  if (presets) {
    logger.warn(
      '"Custom presets" is an experimental and undocumented feature that will be changed or deprecated soon. Use it on your own risk.'
    );

    return presets;
  }

  return [];
}

async function getWebpackConfig(options, presets) {
  const babelOptions = await presets.babel({}, options);

  const entries = {
    iframe: await presets.preview([], options),
    manager: await presets.manager([], options),
  };

  const webpackConfig = await presets.webpack({}, { ...options, babelOptions, entries });

  return presets.webpackFinal(webpackConfig, options);
}

export default async options => {
  const { corePresets = [], frameworkPresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('./core-preset-babel-cache.js'),
    ...frameworkPresets,
    ...customPreset(options),
    require.resolve('./core-preset-webpack-custom.js'),
  ];

  const presets = loadPresets(presetsConfig);

  return getWebpackConfig({ ...restOptions, presets }, wrapCorePresets(presets));
};
