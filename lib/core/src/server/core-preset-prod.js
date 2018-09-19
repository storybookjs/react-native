import loadCustomBabelConfig from './loadCustomBabelConfig';
import createProdConfig from './config/webpack.config.prod';
import defaultBabelConfig from './config/babel.prod';
import { createManagerEntry, createPreviewEntry } from './config/entries';

export function webpack(_, options) {
  return createProdConfig(options);
}

export function babel(_, options) {
  const { configDir, presets } = options;

  return loadCustomBabelConfig(configDir, () =>
    presets.apply('babelDefault', defaultBabelConfig, options)
  );
}

export function manager(_, options) {
  return createManagerEntry(options);
}

export function preview(_, options) {
  return createPreviewEntry(options);
}
