import loadCustomBabelConfig from './loadCustomBabelConfig';
import createDevConfig from './config/webpack.config.dev';
import defaultBabelConfig from './config/babel.dev';
import { createManagerEntry, createPreviewEntry } from './config/entries';

function extendWebpack(_, options) {
  return createDevConfig(options);
}

function extendBabel(_, { configDir, wrapDefaultBabelConfig }) {
  return loadCustomBabelConfig(configDir, wrapDefaultBabelConfig(defaultBabelConfig));
}

function extendManager(_, options) {
  return createManagerEntry(options);
}

function extendPreview(_, options) {
  return [
    ...createPreviewEntry(options),
    `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
  ];
}

export default {
  extendWebpack,
  extendBabel,
  extendManager,
  extendPreview,
};
