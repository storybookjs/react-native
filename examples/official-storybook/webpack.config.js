const path = require('path');
const { DefinePlugin, ContextReplacementPlugin } = require('webpack');

module.exports = async ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.stories\.jsx?$/,
        use: require.resolve('@storybook/addon-storysource/loader'),
        include: [
          path.resolve(__dirname, './stories'),
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
        enforce: 'pre',
      },
      {
        test: /\.js/,
        use: config.module.rules[0].use,
        include: [
          path.resolve(__dirname, '../../app/react'),
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
      },
    ],
  },
  resolve: {
    ...config.resolve,
    // https://github.com/graphql/graphql-js#using-in-a-browser
    extensions: ['.mjs', ...config.resolve.extensions],
  },
  plugins: [
    ...config.plugins,
    // graphql sources check process variable
    new DefinePlugin({
      process: JSON.stringify(true),
    }),
    // See https://github.com/graphql/graphql-language-service/issues/111#issuecomment-306723400
    new ContextReplacementPlugin(/graphql-language-service-interface[/\\]dist/, /\.js$/),
  ],
});
