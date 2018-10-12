import path from 'path';
import webpack from 'webpack';
import { getEnvironment } from 'universal-dotenv';
import Dotenv from 'dotenv-webpack';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import {
  includePaths,
  excludePaths,
  nodeModulesPaths,
  loadEnv,
  nodePaths,
  getBabelRuntimePath,
} from './utils';
import { getPreviewHeadHtml, getManagerHeadHtml, getPreviewBodyHtml } from '../utils';
import { version } from '../../../package.json';

export default ({ configDir, quiet, babelOptions, entries }) => {
  const entriesMeta = {
    iframe: {
      headHtmlSnippet: getPreviewHeadHtml(configDir, process.env),
      bodyHtmlSnippet: getPreviewBodyHtml(),
    },
    manager: {
      headHtmlSnippet: getManagerHeadHtml(configDir, process.env),
    },
  };

  return {
    name: 'iframe',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: { iframe: entries.iframe },
    output: {
      path: path.join(__dirname, '..', 'public'),
      filename: '[name].bundle.js',
      // Here we set the publicPath to ''.
      // This allows us to deploy storybook into subpaths like GitHub pages.
      // This works with css and image loaders too.
      // This is working for storybook since, we don't use pushState urls and
      // relative URLs works always.
      publicPath: '',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: `iframe.html`,
        chunksSortMode: 'none',
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, options) => ({
          compilation,
          files,
          options,
          version,
          ...entriesMeta.iframe,
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new webpack.DefinePlugin(loadEnv()),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      // quiet ? null : new webpack.ProgressPlugin(),
      new webpack.DefinePlugin(getEnvironment().webpack),
      new Dotenv({ silent: true }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions,
            },
          ],
          include: includePaths,
          exclude: excludePaths,
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: require.resolve('raw-loader'),
            },
          ],
        },
      ],
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.jsx', '.json'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
      alias: {
        '@babel/runtime': getBabelRuntimePath(),
      },
    },
    performance: {
      hints: false,
    },
  };
};
