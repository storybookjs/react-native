import loadCustomBabelConfig from '../utils/load-custom-babel-config';
import loadCustomConfig from '../utils/load-custom-config-file';
import devBabelConfig from '../common/babel.dev';
import prodBabelConfig from '../common/babel.prod';

import devWebpackConfig from './webpack.config.iframe.dev';
import prodWebpackConfig from './webpack.config.iframe.prod';
import { createPreviewEntry } from './entries';

export async function webpack(_, options) {
  return options.configType === 'PRODUCTION'
    ? prodWebpackConfig(options)
    : devWebpackConfig(options);
}

export async function babel(_, options) {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply(
      'babelDefault',
      options.configType === 'PRODUCTION' ? prodBabelConfig : devBabelConfig,
      options
    )
  );
}

export async function entries(_, options) {
  let result = [];

  result = result.concat(await createPreviewEntry(options));

  if (options.configType === 'DEVELOPMENT') {
    result = result.concat(`${require.resolve('webpack-hot-middleware/client')}?reload=true`);
  }

  return result;
}

export async function config(_, options) {
  return loadCustomConfig(options);
}
