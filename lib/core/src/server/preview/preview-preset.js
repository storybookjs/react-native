import loadCustomBabelConfig from '../utils/load-custom-babel-config';
import loadCustomConfig from '../utils/load-custom-config-file';
import babelConfig from '../common/babel';

import webpackConfig from './iframe-webpack.config';
import { createPreviewEntry } from './entries';

export const webpack = async (_, options) => webpackConfig(options);

export const babel = async (_, options) => {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', babelConfig(options), options)
  );
};

export const entries = async (_, options) => {
  let result = [];

  result = result.concat(await createPreviewEntry(options));

  if (options.configType === 'DEVELOPMENT') {
    result = result.concat(`${require.resolve('webpack-hot-middleware/client')}?reload=true`);
  }

  return result;
};

export const config = async (_, options) => loadCustomConfig(options);
