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
          path.resolve(__dirname, '../../lib/ui/src'),
          path.resolve(__dirname, '../../lib/components/src'),
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    ],
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
  resolve: {
    ...config.resolve,
    extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
  },
});
