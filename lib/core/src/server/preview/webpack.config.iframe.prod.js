import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

import {
  includePaths,
  excludePaths,
  loadEnv,
  nodePaths,
  getBabelRuntimePath,
} from '../config/utils';
import { getPreviewHeadHtml, getPreviewBodyHtml } from '../utils/template';

export default ({
  configDir,
  babelOptions,
  entries,
  outputDir = path.join('.', 'public'),
  quiet,
  packageJson,
}) => {
  const environment = loadEnv({ production: true });

  return {
    mode: 'production',
    bail: true,
    devtool: '#cheap-module-source-map',
    entry: entries,
    output: {
      path: path.join(process.cwd(), outputDir),
      filename: '[name].[hash].bundle.js',
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
          version: packageJson.version,
          headHtmlSnippet: getPreviewHeadHtml(configDir, process.env),
          bodyHtmlSnippet: getPreviewBodyHtml(),
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new webpack.DefinePlugin(environment),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      quiet ? null : new webpack.ProgressPlugin(),
      new Dotenv({ silent: true }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(mjs|jsx?)$/,
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
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
      mainFields: ['browser', 'main', 'module'],
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
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
  };
};
