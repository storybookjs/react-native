const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = (baseConfig, env, defaultConfig) => ({
  ...defaultConfig,
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        include: [
          path.resolve(__dirname, './stories'),
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
        enforce: 'pre',
      },
      {
        test: /\.js/,
        loaders: ['babel-loader'],
        include: [
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
      },
    ],
  },
  resolve: {
    ...defaultConfig.resolve,
    // https://github.com/graphql/graphql-js#using-in-a-browser
    extensions: ['.mjs', ...defaultConfig.resolve.extensions],
  },
  plugins: [
    ...defaultConfig.plugins,
    // graphql sources check process variable
    new DefinePlugin({
      process: JSON.stringify(true),
    }),
  ],
});
