import path from 'path';
import webpack from 'webpack';
import { getEnvironment } from 'universal-dotenv';
import Dotenv from 'dotenv-webpack';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { getManagerHeadHtml } from '@storybook/core/server';

import { includePaths, excludePaths, nodeModulesPaths } from './utils';
import { version } from '../../../package.json';

const getConfig = options => {
  const entriesMeta = {
    manager: {
      headHtmlSnippet: getManagerHeadHtml(options.configDir, process.env),
    },
  };

  return {
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
        filename: `index.html`,
        chunksSortMode: 'none',
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, o) => ({
          compilation,
          files,
          options: o,
          version,
          ...entriesMeta.manager,
        }),
        template: require.resolve(`@storybook/core/src/server/templates/index.ejs`),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      new webpack.DefinePlugin(getEnvironment().webpack),
      new Dotenv({ silent: true }),
      new webpack.DefinePlugin({
        storybookOptions: JSON.stringify(options),
      }),
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
          loader: require.resolve('raw-loader'),
        },
      ],
    },
  };
};

export default getConfig;
