import path from 'path';
import webpack from 'webpack';
import { includePaths, excludePaths } from './paths';

const entries = {
  preview: [
    path.resolve(__dirname, './polyfills'),
  ],
  manager: [
    path.resolve(__dirname, './polyfills'),
    path.resolve(__dirname, '../../client/manager'),
  ],
};

const config = {
  bail: true,
  devtool: '#cheap-module-source-map',
  entry: entries,
  output: {
    filename: 'static/[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: require('./babel.prod.js'),
        include: includePaths,
        exclude: excludePaths,
      },
    ],
  },
};

export default config;
