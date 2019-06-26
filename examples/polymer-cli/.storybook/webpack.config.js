const path = require('path');
const webpack = require('webpack');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/],
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    include: [path.resolve(__dirname, '../src')],
    enforce: 'pre',
  });
  config.plugins.push(new webpack.IgnorePlugin(/vertx/));
  return config;
};
