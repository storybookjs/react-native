import loadCustomBabelConfig from './loadCustomBabelConfig';
import createDevConfig from './config/webpack.config';
import defaultBabelConfig from './config/babel';

function extendWebpack(_, options) {
  return createDevConfig(options);
}

function extendBabel(_, { configDir, wrapDefaultBabelConfig }) {
  return loadCustomBabelConfig(configDir) || wrapDefaultBabelConfig(defaultBabelConfig);
}

export default {
  extendWebpack,
  extendBabel,
};
