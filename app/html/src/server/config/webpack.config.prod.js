import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import InterpolateHtmlPlugin from '@storybook/react-dev-utils/InterpolateHtmlPlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {
  managerPath,
  getPreviewHeadHtml,
  getManagerHeadHtml,
  indexHtmlPath,
  iframeHtmlPath,
} from '@storybook/core/server';
import babelLoaderConfig from './babel.prod';
import { includePaths, excludePaths, loadEnv, nodePaths } from './utils';
import { version } from '../../../package.json';

export default function(configDir) {
  const entries = {
    preview: [require.resolve('./polyfills'), require.resolve('./globals')],
    manager: [require.resolve('./polyfills'), managerPath],
  };

  const config = {
    mode: 'production',
    bail: true,
    devtool: '#cheap-module-source-map',
    entry: entries,
    output: {
      filename: 'static/[name].[chunkhash].bundle.js',
      // Here we set the publicPath to ''.
      // This allows us to deploy storybook into subpaths like GitHub pages.
      // This works with css and image loaders too.
      // This is working for storybook since, we don't use pushState urls and
      // relative URLs works always.
      publicPath: '',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['manager', 'runtime~manager'],
        chunksSortMode: 'none',
        data: {
          managerHead: getManagerHeadHtml(configDir),
          version,
        },
        template: indexHtmlPath,
      }),
      new HtmlWebpackPlugin({
        filename: 'iframe.html',
        excludeChunks: ['manager', 'runtime~manager'],
        chunksSortMode: 'none',
        data: {
          previewHead: getPreviewHeadHtml(configDir),
        },
        template: iframeHtmlPath,
      }),
      new InterpolateHtmlPlugin(process.env),
      new webpack.DefinePlugin(loadEnv({ production: true })),
      new Dotenv({ silent: true }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: require.resolve('babel-loader'),
          query: babelLoaderConfig,
          include: includePaths,
          exclude: excludePaths,
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: require.resolve('html-loader'),
            },
          ],
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
      extensions: ['.js', '.json'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
    },
    optimization: {
      // Automatically split vendor and commons for preview bundle
      // https://twitter.com/wSokra/status/969633336732905474
      splitChunks: {
        chunks: chunk => chunk.name !== 'manager',
      },
      // Keep the runtime chunk seperated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
  };

  return config;
}
