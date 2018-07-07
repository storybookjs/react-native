import path from 'path';
import webpack from 'webpack';
import { getEnvironment } from 'universal-dotenv';
import Dotenv from 'dotenv-webpack';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { getPreviewHeadHtml, getManagerHeadHtml } from '../utils';

import {
  includePaths,
  excludePaths,
  nodeModulesPaths,
  loadEnv,
  nodePaths,
  getEntries,
} from './utils';
import { version } from '../../../package.json';

export default ({ configDir, quiet, babelOptions }) => {
  const entries = getEntries(configDir, true);
  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
      ...entries,
      preview: [
        ...entries.preview,
        `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
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
      new InterpolateHtmlPlugin(process.env),
      new webpack.DefinePlugin(loadEnv()),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      quiet ? null : new webpack.ProgressPlugin(),
      new webpack.DefinePlugin(getEnvironment().webpack),
      new Dotenv({ silent: true }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
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
      extensions: ['.js', '.json'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
    },
    performance: {
      hints: false,
    },
  };
};
