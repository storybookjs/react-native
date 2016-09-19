import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from './WatchMissingNodeModulesPlugin';
import {
  OccurenceOrderPlugin,
  includePaths,
  excludePaths,
  nodeModulesPaths,
  loadEnv,
} from './utils';
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
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin(loadEnv()),
    new OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(nodeModulesPaths),
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
  resolve: {
    alias: {
      // This is to add addon support for NPM2
      '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons'),
    }
  }
};

export default config;
