import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { version } from '../../../package.json';
import { includePaths, excludePaths, loadEnv, nodePaths, getBabelRuntimePath } from './utils';
import { getPreviewHeadHtml, getManagerHeadHtml, getPreviewBodyHtml } from '../utils';

export default ({ configDir, babelOptions, entries }) => {
  const environment = loadEnv({ production: true });
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
      ...Object.keys(entries).map(
        e =>
          new HtmlWebpackPlugin({
            filename: `${e === 'manager' ? 'index' : e}.html`,
            excludeChunks: Object.keys(entries).filter(i => i !== e),
            chunksSortMode: 'none',
            alwaysWriteToDisk: true,
            inject: false,
            templateParameters: (compilation, files, options) => ({
              compilation,
              files,
              options,
              version,
              ...entriesMeta[e],
            }),
            template: require.resolve(`../templates/index.ejs`),
          })
      ),
      new webpack.DefinePlugin(environment),
      new Dotenv({ silent: true }),
    ],
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
