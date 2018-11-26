import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';

import {
  includePaths,
  excludePaths,
  nodeModulesPaths,
  loadEnv,
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
  configType,
}) => {
  const { raw, stringified } = loadEnv({ production: true });
  const isProd = configType === 'PRODUCTION';

  return {
    mode: isProd ? 'production' : 'development',
    bail: isProd,
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
          dlls: [],
          bodyHtmlSnippet: getPreviewBodyHtml(),
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new webpack.DefinePlugin({ 'process.env': stringified }),
      isProd ? null : new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      isProd ? null : new webpack.HotModuleReplacementPlugin(),
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
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'].concat(raw.NODE_PATH || []),
      mainFields: ['browser', 'main', 'module'],
      alias: {
        '@babel/runtime': getBabelRuntimePath(),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
      minimizer: [
        new TerserWebpackPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            mangle: false,
          },
        }),
      ],
    },
    performance: {
      hints: isProd ? 'warning' : false,
    },
  };
};
