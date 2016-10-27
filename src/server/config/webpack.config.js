import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from './WatchMissingNodeModulesPlugin';
import {
  OccurenceOrderPlugin,
  includePaths,
  excludePaths,
  nodeModulesPaths,
  loadEnv,
  nodePaths,
} from './utils';
import babelLoaderConfig from './babel.js';

export default function () {
  const config = {
    devtool: '#cheap-module-eval-source-map',
    entry: {
      manager: [
        require.resolve('./polyfills'),
        require.resolve('../../client/manager'),
      ],
      preview: [
        require.resolve('./polyfills'),
        require.resolve('./error_enhancements'),
        require.resolve('./globals'),
        `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
      publicPath: '/',
    },
    plugins: [
      new webpack.DefinePlugin(loadEnv()),
      new OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(nodeModulesPaths),
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          query: babelLoaderConfig,
          include: includePaths,
          exclude: excludePaths,
        },
      ],
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.json', '.jsx', ''],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      fallback: nodePaths,
      alias: {
        // This is to add addon support for NPM2
        '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons'),
      },
    },
  };

  return config;
}
