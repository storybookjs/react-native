const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: [/\.stories\.js$/, /index\.js$/],
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        include: [path.resolve(__dirname, '../src')],
        enforce: 'pre',
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin(/vertx/)],
};
