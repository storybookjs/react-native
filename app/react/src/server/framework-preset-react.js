import wrapBabelConfig from './wrapBabelConfig';

function extendBabel(config) {
  return wrapBabelConfig(config);
}

export default {
  extendBabel,
};
