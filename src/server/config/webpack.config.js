import path from 'path';
import webpack from 'webpack';
import { includePaths, excludePaths } from './paths';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [
      path.resolve(__dirname, '../../client/manager'),
    ],
    preview: [
      path.resolve(__dirname, './error_enhancements'),
      'webpack-hot-middleware/client?noInfo=true',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: require('./babel.js'),
        include: includePaths,
        exclude: excludePaths,
      },
    ],
  },
};

export default config;
