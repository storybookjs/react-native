import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import uiPaths from '@storybook/ui/paths';

import findCacheDir from 'find-cache-dir';

import { version } from '../../../package.json';
import { getManagerHeadHtml } from '../utils/template';
import { loadEnv } from '../config/utils';

const coreDirName = path.dirname(require.resolve('@storybook/core/package.json'));
const context = path.join(coreDirName, '../../node_modules');
const cacheDir = findCacheDir({ name: 'storybook' });

export default ({ configDir, configType, entries, outputDir, cache }) => {
  const { raw, stringified } = loadEnv();
  const isProd = configType === 'PRODUCTION';

  return {
    name: 'manager',
    mode: isProd ? 'production' : 'development',
    bail: isProd,
    devtool: 'none',
    entry: entries,
    output: {
      path: outputDir,
      filename: '[name].[chunkhash].bundle.js',
      publicPath: '',
    },
    cache,
    plugins: [
      new webpack.DllReferencePlugin({
        context,
        manifest: path.join(__dirname, '../../../dll/storybook_ui-manifest.json'),
      }),
      new HtmlWebpackPlugin({
        filename: `index.html`,
        chunksSortMode: 'none',
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, options) => ({
          compilation,
          files,
          options,
          version,
          dlls: ['/sb_dll/storybook_ui_dll.js'],
          headHtmlSnippet: getManagerHeadHtml(configDir, process.env),
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new webpack.DefinePlugin({ 'process.env': stringified }),
      new CaseSensitivePathsPlugin(),
      new Dotenv({ silent: true }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'].concat(raw.NODE_PATH || []),
      alias: {
        'core-js': path.dirname(require.resolve('core-js/package.json')),
        ...uiPaths,
      },
    },
    recordsPath: path.join(cacheDir, 'records.json'),
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
    },
  };
};
