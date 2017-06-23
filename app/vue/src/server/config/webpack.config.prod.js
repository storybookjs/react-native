import path from 'path';
import webpack from 'webpack';
import babelLoaderConfig from './babel.prod';
import { includePaths, excludePaths, loadEnv, nodePaths } from './utils';

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
        'vue$': require.resolve('vue/dist/vue.esm.js'),
        'react$': require.resolve('react'),
        'react-dom$': require.resolve('react-dom'),
      }
    },
  };

  return config;
}
