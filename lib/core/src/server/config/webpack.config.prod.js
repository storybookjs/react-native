import webpack from 'webpack';
import { getEnvironment } from 'universal-dotenv';
import Dotenv from 'dotenv-webpack';
import GeneratePagePlugin from 'generate-page-webpack-plugin';

import { version } from '../../../package.json';
import { getPreviewHeadHtml, getManagerHeadHtml, getPreviewBodyHtml } from '../utils';

import { includePaths, excludePaths, loadEnv, nodePaths, getEntries } from './utils';

export default ({ configDir, babelOptions }) => {
  const entries = getEntries(configDir);

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
      new GeneratePagePlugin(
        {
          template: require.resolve('../templates/index.html.ejs'),
          // eslint-disable-next-line global-require
          parser: require('ejs'),
          filename: entry => (entry === 'manager' ? 'index' : entry),
        },
        {
          data: { version },
          headHtmlSnippet: entry =>
            entriesMeta[entry] ? entriesMeta[entry].headHtmlSnippet : null,
          bodyHtmlSnippet: entry =>
            entriesMeta[entry] ? entriesMeta[entry].bodyHtmlSnippet : null,
        }
      ),
      new webpack.DefinePlugin(loadEnv({ production: true })),
      new webpack.DefinePlugin(getEnvironment().webpack),
      new Dotenv({ silent: true }),
    ],
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
};
