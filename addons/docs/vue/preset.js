const commonExports = require('../dist/frameworks/common/makePreset').default('vue');

const webpack = (webpackConfig, options) => {
  const config = commonExports.webpack(webpackConfig, options);
  config.module.rules.push({
    test: /\.vue$/,
    loader: 'storybook-addon-vue-info/loader',
    enforce: 'post',
  });
  return config;
};

module.exports = {
  ...commonExports,
  webpack,
};
