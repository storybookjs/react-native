import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from '@ndelangen/html-webpack-harddisk-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

import { version } from '../../../package.json';
import { getManagerHeadHtml } from '../utils/template';
import { loadEnv, getBabelRuntimePath } from '../config/utils';

export default ({ configDir, entries, outputDir, configType }) => {
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
    plugins: [
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
          headHtmlSnippet: getManagerHeadHtml(configDir, process.env),
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new HtmlWebpackHarddiskPlugin(),
      new webpack.DefinePlugin({ 'process.env': stringified }),
      new CaseSensitivePathsPlugin(),
      new Dotenv({ silent: true }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'].concat(raw.NODE_PATH || []),
      alias: {
        '@babel/runtime': getBabelRuntimePath(),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
    },
  };
};
