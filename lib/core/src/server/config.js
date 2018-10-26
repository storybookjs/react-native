import path from 'path';
import { logger } from '@storybook/node-logger';
import loadPresets from './presets';
import serverRequire from './utils/server-require';

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

async function getPreviewWebpackConfig(options, presets) {
  const babelOptions = await presets.apply('babel', {}, options);
  const entries = await presets.apply('entries', [], options);

  return presets.apply('webpack', {}, { ...options, babelOptions, entries });
}

export default async options => {
  const { corePresets = [], frameworkPresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('./common/core-preset-babel-cache.js'),
    ...frameworkPresets,
    ...customPreset(options),
    ...overridePresets,
  ];

  const presets = loadPresets(presetsConfig);

  return getPreviewWebpackConfig({ ...restOptions, presets }, presets);
};

async function getManagerWebpackConfig(options, presets) {
  const babelOptions = undefined;
  const entries = await presets.apply('managerEntries', [], options);

  return presets.apply('managerWebpack', {}, { ...options, babelOptions, entries });
}

export const managerOptions = async options => {
  const { corePresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('./common/core-preset-babel-cache.js'),
    ...overridePresets,
  ];

  const presets = loadPresets(presetsConfig);

  return getManagerWebpackConfig({ ...restOptions, presets }, presets);
};
