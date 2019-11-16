import path from 'path';
import { DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CoreJSUpgradeWebpackPlugin from 'corejs-upgrade-webpack-plugin';
import VirtualModulePlugin from 'webpack-virtual-modules';

import resolveFrom from 'resolve-from';
import toRegex from 'glob-regex';
import globBase from 'glob-base';

import babelLoader from '../common/babel-loader';
import { nodeModulesPaths, loadEnv } from '../config/utils';
import { getPreviewHeadHtml, getPreviewBodyHtml } from '../utils/template';

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;

const reactPaths = {};
try {
  reactPaths.react = path.dirname(resolveFrom(process.cwd(), 'react/package.json'));
  reactPaths['react-dom'] = path.dirname(resolveFrom(process.cwd(), 'react-dom/package.json'));
} catch (e) {
  //
}

const toRequireContext = input => {
  switch (true) {
    case typeof input === 'string': {
      const { base, glob } = globBase(input);
      const regex = toRegex(glob)
        .toString()
        .replace('^([^\\/]+)', '');

      return `require.context('${base}', true, ${regex})`;
    }
    case isObject(input): {
      const { path: p, recursive: r, match: m } = input;
      return `require.context('${p}', ${r}, ${m})`;
    }

    default: {
      throw new Error('the provided input cannot be transformed into a require.context');
    }
  }
};

export default ({
  configDir,
  babelOptions,
  entries,
  stories,
  outputDir = path.join('.', 'public'),
  quiet,
  packageJson,
  configType,
  framework,
}) => {
  const { raw, stringified } = loadEnv({ production: true });
  const isProd = configType === 'PRODUCTION';

  return {
    mode: isProd ? 'production' : 'development',
    bail: isProd,
    devtool: '#cheap-module-source-map',
    entry: entries,
    output: {
      path: path.resolve(process.cwd(), outputDir),
      filename: '[name].[hash].bundle.js',
      publicPath: '',
    },
    plugins: [
      stories && stories.length
        ? new VirtualModulePlugin({
            [path.resolve(path.join(configDir, `generated-entry.js`))]: `
              import { configure, addDecorator, addParameters } from '@storybook/${framework}';

              configure([${stories.map(toRequireContext).join(',')}
              ], module);
            `,
          })
        : null,
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
          globals: {},
          headHtmlSnippet: getPreviewHeadHtml(configDir, process.env),
          dlls: [],
          bodyHtmlSnippet: getPreviewBodyHtml(configDir, process.env),
        }),
        template: require.resolve(`../templates/index.ejs`),
      }),
      new DefinePlugin({
        'process.env': stringified,
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      isProd ? null : new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      isProd ? null : new HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      quiet ? null : new ProgressPlugin(),
      new Dotenv({ silent: true }),
      new CoreJSUpgradeWebpackPlugin({ resolveFrom: __dirname }),
    ].filter(Boolean),
    module: {
      rules: [
        babelLoader(babelOptions),
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
      alias: {
        'babel-runtime/core-js/object/assign': require.resolve('core-js/es/object/assign'),
        ...reactPaths,
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
            keep_fnames: true,
          },
        }),
      ],
    },
    performance: {
      hints: isProd ? 'warning' : false,
    },
  };
};
