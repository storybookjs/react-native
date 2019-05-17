import path from 'path';
import webpack, { DefinePlugin, ContextReplacementPlugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import themingPaths from '@storybook/theming/paths';
import uiPaths from '@storybook/ui/paths';

import findCacheDir from 'find-cache-dir';

import { version } from '../../../package.json';
import { getManagerHeadHtml } from '../utils/template';
import { loadEnv } from '../config/utils';
import babelLoader from '../common/babel-loader';

const coreDirName = path.dirname(require.resolve('@storybook/core/package.json'));
const context = path.join(coreDirName, '../../node_modules');
const cacheDir = findCacheDir({ name: 'storybook' });

export default ({ configDir, configType, entries, dll, outputDir, cache, babelOptions }) => {
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
      dll
        ? new webpack.DllReferencePlugin({
            context,
            manifest: path.join(__dirname, '../../../dll/storybook_ui-manifest.json'),
          })
        : null,
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
          dlls: dll ? ['./sb_dll/storybook_ui_dll.js'] : [],
          headHtmlSnippet: getManagerHeadHtml(configDir, process.env),
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new CaseSensitivePathsPlugin(),
      new Dotenv({ silent: true }),
      // graphql sources check process variable
      new DefinePlugin({
        process: { browser: true, env: stringified },
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      // See https://github.com/graphql/graphql-language-service/issues/111#issuecomment-306723400
      new ContextReplacementPlugin(/graphql-language-service-interface[/\\]dist/, /\.js$/),
    ].filter(Boolean),
    module: {
      rules: [
        babelLoader(babelOptions),
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
          ],
        },
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
          loader: require.resolve('file-loader'),
          query: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          query: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'].concat(raw.NODE_PATH || []),
      alias: {
        ...themingPaths,
        ...uiPaths,
      },
    },
    recordsPath: path.join(cacheDir, 'records.json'),
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
    },
  };
};
