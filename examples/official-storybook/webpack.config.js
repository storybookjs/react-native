const path = require('path');

module.exports = async ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules.slice(1),
      {
        test: /\.(mjs|jsx?|tsx?)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: `.cache/storybook`,
              presets: [
                ['@babel/preset-env', { shippedProposals: true, useBuiltIns: 'usage', corejs: 3 }],
                '@babel/preset-typescript',
                ['babel-preset-minify', { builtIns: false, mangle: false }],
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                ['babel-plugin-emotion', { sourceMap: true, autoLabel: true }],
                'babel-plugin-macros',
                '@babel/plugin-transform-react-constant-elements',
                'babel-plugin-add-react-displayname',
                [
                  'babel-plugin-react-docgen',
                  { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' },
                ],
              ],
            },
          },
        ],
        exclude: [/node_modules/, /dist/],
      },
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
    ],
  },
  resolve: {
    ...config.resolve,
    extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
  },
});
