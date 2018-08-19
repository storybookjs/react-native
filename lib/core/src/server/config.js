import path from 'path';
import loadPresets from './presets';
import serverRequire from './serverRequire';

const noopWrapper = config => config;

function customPreset({ configDir }) {
  return serverRequire(path.resolve(configDir, 'presets')) || [];
}

function getBabelConfig(options, presets) {
  const { configDir, wrapDefaultBabelConfig = noopWrapper } = options;
  return presets.extendBabel({}, { configDir, wrapDefaultBabelConfig });
}

function getWebpackConfig(options, presets) {
  const babelOptions = getBabelConfig(options, presets);
  return presets.extendWebpack({}, { ...options, babelOptions, presets });
}

export default options => {
  const { corePresets, frameworkPresets, ...restOptions } = options;

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
