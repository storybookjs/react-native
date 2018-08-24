import loadCustomBabelConfig from './loadCustomBabelConfig';
import createProdConfig from './config/webpack.config.prod';
import defaultBabelConfig from './config/babel.prod';
import { createManagerEntry, createPreviewEntry } from './config/entries';

function extendWebpack(_, options) {
  return createProdConfig(options);
}

function extendBabel(_, { configDir }) {
  return loadCustomBabelConfig(configDir) || defaultBabelConfig;
}

function extendManager(_, options) {
  return createManagerEntry(options);
}

function extendPreview(_, options) {
  return createPreviewEntry(options);
}

export default {
  extendWebpack,
  extendBabel,
  extendManager,
  extendPreview,
};
