import path from 'path';
import webpack from 'webpack';

const resolveLocal = dir => path.join(__dirname, dir);
const toSafeFilename = packageName => packageName.replace('@', '').replace(/[^a-z]/g, '_');

const r = resolveLocal('../../../node_modules');

export default ({ entry, provided = [] }) => ({
  name: 'storybook-ui',
  mode: 'production',

  entry,
  output: {
    path: resolveLocal('.'),
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
    // alias: {
    //   react: require.resolve('react'),
    //   'prop-types': require.resolve('prop-types'),
    //   'react-dom': require.resolve('react-dom'),
    // },
  },

  plugins: [
    // ...provided.map(
    //   p =>
    //     new webpack.DllReferencePlugin({
    //       context: resolveLocal('.'),
    //       manifest: require(`./${toSafeFilename(p)}-manifest.json`),
    //     })
    // ),
    new webpack.DllPlugin({
      context: r,
      path: `${__dirname}/[name]-manifest.json`,
      name: '[name]_dll',
    }),
  ],
  performance: {
    hints: false,
  },
});
