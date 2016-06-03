import path from 'path';
import webpack from 'webpack';

const managerEntry =
  process.env.DEV_BUILD ?
  path.resolve(__dirname, '../../src/client/manager') :
  path.resolve(__dirname, '../manager');

const config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [
      managerEntry,
    ],
    preview: [
      path.resolve(__dirname, './error_enhancements'),
      'webpack-hot-middleware/client',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: { presets: ['react', 'es2015', 'stage-0'] },
        exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
        include: [path.resolve('./'), __dirname, path.resolve(__dirname, '../../src')],
      },
    ],
  },
};

export default config;
