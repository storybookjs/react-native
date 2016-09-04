import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { OccurenceOrderPlugin, includePaths, excludePaths } from './utils';
import babalLoaderConfig from './babel.js';

const config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [
      require.resolve('./polyfills'),
      require.resolve('../../client/manager'),
    ],
    preview: [
      require.resolve('./polyfills'),
      require.resolve('./error_enhancements'),
      require.resolve('webpack-hot-middleware/client'),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: babalLoaderConfig,
        include: includePaths,
        exclude: excludePaths,
      },
    ],
  },
};

export default config;
