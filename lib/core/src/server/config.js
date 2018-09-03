import path from 'path';
import loadPresets from './presets';
import serverRequire from './serverRequire';

function customPreset({ configDir }) {
  return serverRequire(path.resolve(configDir, 'presets')) || [];
}

function getWebpackConfig(options, presets) {
  const babelOptions = presets.extendBabel({}, options);

  const entries = {
    iframe: presets.extendPreview([], options),
    manager: presets.extendManager([], options),
  };

  return presets.extendWebpack({}, { ...options, babelOptions, entries });
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
