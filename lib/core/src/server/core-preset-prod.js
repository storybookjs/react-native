import loadCustomBabelConfig from './loadCustomBabelConfig';
import createProdConfig from './config/webpack.config.prod';
import defaultBabelConfig from './config/babel.prod';

function extendWebpack(_, options) {
  return createProdConfig(options);
}

function extendBabel(_, { configDir, wrapDefaultBabelConfig }) {
  return loadCustomBabelConfig(configDir) || wrapDefaultBabelConfig(defaultBabelConfig);
}

export default {
  extendWebpack,
  extendBabel,
};
