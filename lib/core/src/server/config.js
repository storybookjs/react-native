import path from 'path';
import { logger } from '@storybook/node-logger';
import loadPresets from './presets';
import serverRequire from './serverRequire';

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

function getWebpackConfig(options, presets) {
  const babelOptions = presets.babel({}, options);

  const entries = {
    iframe: presets.preview([], options),
    manager: presets.manager([], options),
  };

  return presets.eebpack({}, { ...options, babelOptions, entries });
}

export default options => {
  const { corePresets = [], frameworkPresets = [], ...restOptions } = options;

  const presetsConfig = [
    ...corePresets,
    require.resolve('./core-preset-babel-cache.js'),
    ...frameworkPresets,
    ...customPreset(options),
    require.resolve('./core-preset-webpack-custom.js'),
  ];

  const presets = loadPresets(presetsConfig);

  return getWebpackConfig(restOptions, presets);
};
