import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { managerPath, getPreviewHeadHtml, getManagerHeadHtml } from '@storybook/core/server';

import { includePaths, excludePaths, loadEnv, nodePaths } from './utils';
import babelLoaderConfig from './babel';
import { version } from '../../../package.json';

export default function(configDir) {
  const config = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
      manager: [require.resolve('./polyfills'), managerPath],
      preview: [
        require.resolve('./polyfills'),
        require.resolve('./globals'),
        `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['manager'],
        chunksSortMode: 'none',
        data: {
          managerHead: getManagerHeadHtml(configDir),
          version,
        },
        template: require.resolve('../index.html.ejs'),
      }),
      new HtmlWebpackPlugin({
        filename: 'iframe.html',
        excludeChunks: ['manager'],
        chunksSortMode: 'none',
        data: {
          previewHead: getPreviewHeadHtml(configDir),
        },
        template: require.resolve('../iframe.html.ejs'),
      }),
      new webpack.DefinePlugin(loadEnv()),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.ProgressPlugin(),
      new Dotenv({ silent: true }),
    ],
    module: {
      rules: [
        {
          test: /\.marko$/,
          loader: require.resolve('marko-loader'),
        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          query: babelLoaderConfig,
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
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.json', '.jsx', '.marko'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
    },
    performance: {
      hints: false,
    },
  };

  return config;
}
