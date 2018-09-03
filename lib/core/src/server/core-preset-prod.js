import loadCustomBabelConfig from './loadCustomBabelConfig';
import createProdConfig from './config/webpack.config.prod';
import defaultBabelConfig from './config/babel.prod';
import { createManagerEntry, createPreviewEntry } from './config/entries';

export function webpack(_, options) {
  return createProdConfig(options);
}

export function babel(_, { configDir }) {
  return loadCustomBabelConfig(configDir, defaultBabelConfig);
}

export function manager(_, options) {
  return createManagerEntry(options);
}

export function preview(_, options) {
  return createPreviewEntry(options);
}
