import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from './WatchMissingNodeModulesPlugin';
import { includePaths, excludePaths, nodeModulesPaths, loadEnv, nodePaths } from './utils';
import babelLoaderConfig from './babel';

export default function() {
  const config = {
    devtool: 'cheap-module-source-map',
    entry: {
      manager: [require.resolve('./polyfills'), require.resolve('../../client/manager')],
      preview: [
        require.resolve('./polyfills'),
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
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(nodeModulesPaths),
      new webpack.ProgressPlugin(),
      new Dotenv(),
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
          test: /\.vue$/,
          loader: require.resolve('vue-loader'),
          options: {},
        },
      ],
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.json', '.jsx'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'].concat(nodePaths),
      alias: {
        vue$: require.resolve('vue/dist/vue.esm.js'),
        react$: require.resolve('react'),
        'react-dom$': require.resolve('react-dom'),
      },
    },
    performance: {
      hints: false,
    },
  };

  return config;
}
