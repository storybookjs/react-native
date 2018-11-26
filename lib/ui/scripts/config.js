import path from 'path';
import webpack from 'webpack';

const resolveLocal = dir => path.join(__dirname, dir);

const r = resolveLocal('../../../node_modules');

const out = resolveLocal('../../core/dll');
export default ({ entry, provided = [] }) => ({
  name: 'storybook-ui',
  mode: 'production',

  entry,
  output: {
    path: out,
    filename: '[name]_dll.js',
    library: '[name]_dll',
  },
  externals: provided,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { shippedProposals: true, modules: false }],
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../../../node_modules')],
  },

  plugins: [
    new webpack.DllPlugin({
      context: r,
      path: `${out}/[name]-manifest.json`,
      name: '[name]_dll',
    }),
  ],
  performance: {
    hints: false,
  },
});
