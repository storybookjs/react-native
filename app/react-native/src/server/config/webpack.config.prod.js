import path from 'path';
import webpack from 'webpack';
import { getEnvironment } from 'universal-dotenv';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { getManagerHeadHtml } from '@storybook/core/dist/server/utils';
import { version } from '../../../package.json';
import { includePaths, excludePaths } from './utils';

const getConfig = options => {
  const entriesMeta = {
    manager: {
      headHtmlSnippet: getManagerHeadHtml(options.configDir, process.env),
    },
  };

  const config = {
    mode: 'production',
    bail: true,
    devtool: '#cheap-module-source-map',
    entry: {
      manager: [path.resolve(__dirname, '../../manager')],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
      // Here we set the publicPath to ''.
      // This allows us to deploy storybook into subpaths like GitHub pages.
      // This works with css and image loaders too.
      // This is working for storybook since, we don't use pushState urls and
      // relative URLs works always.
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
        template: require.resolve(`@storybook/core/dist/server/templates/index.html.ejs`),
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        storybookOptions: JSON.stringify(options),
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin(getEnvironment().webpack),
      new Dotenv({ silent: true }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
        query: require('./babel.prod.js'), // eslint-disable-line
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

  return config;
};

export default getConfig;
