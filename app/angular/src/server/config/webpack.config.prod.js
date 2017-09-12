import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import babelLoaderConfig from './babel.prod';
import { getConfigDir, includePaths, excludePaths, loadEnv, nodePaths } from './utils';
import { getPreviewHeadHtml, getManagerHeadHtml } from '../utils';
import { version } from '../../../package.json';

export default function() {
  const entries = {
    preview: [require.resolve('./polyfills'), require.resolve('./globals')],
    manager: [require.resolve('./polyfills'), path.resolve(__dirname, '../../client/manager')],
  };

  const config = {
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
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['manager'],
        data: {
          managerHead: getManagerHeadHtml(getConfigDir()),
          version,
        },
        template: require.resolve('../index.html.ejs'),
      }),
      new HtmlWebpackPlugin({
        filename: 'iframe.html',
        excludeChunks: ['manager'],
        data: {
          previewHead: getPreviewHeadHtml(getConfigDir()),
        },
        template: require.resolve('../iframe.html.ejs'),
      }),
      new webpack.DefinePlugin(loadEnv({ production: true })),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: false,
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve(__dirname, '../src')
      ),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          query: babelLoaderConfig,
          include: includePaths,
          exclude: excludePaths,
        },
        {
          test: /\.ts?$/,
          loaders: [require.resolve('ts-loader'), require.resolve('angular2-template-loader')],
        },
        {
          test: /\.(html|css)$/,
          loader: 'raw-loader',
          exclude: /\.async\.(html|css)$/,
        },
      ],
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.ts', '.jsx', '.tsx', 'json'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
    },
  };

  return config;
}
