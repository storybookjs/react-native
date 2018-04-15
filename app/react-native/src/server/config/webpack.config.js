import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import WatchMissingNodeModulesPlugin from '@storybook/react-dev-utils/WatchMissingNodeModulesPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { indexHtmlPath } from '@storybook/core/server';
import { version } from '../../../package.json';
import { includePaths, excludePaths, nodeModulesPaths } from './utils';

const getConfig = options => ({
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [require.resolve('../../manager')],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      data: {
        version,
        options: JSON.stringify(options),
      },
      template: indexHtmlPath,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(nodeModulesPaths),
    new Dotenv({ silent: true }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: require('./babel.js'), // eslint-disable-line
        include: includePaths,
        exclude: excludePaths,
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: require.resolve('html-loader'),
          },
          {
            loader: require.resolve('markdown-loader'),
          },
        ],
      },
    ],
  },
});

export default getConfig;
