import path from 'path';
import webpack from 'webpack';
import babelLoaderConfig from './babel.prod.js';
import {
  OccurenceOrderPlugin,
  includePaths,
  excludePaths,
  loadEnv,
  nodePaths,
} from './utils';

export default function () {
  const entries = {
    preview: [
      require.resolve('./polyfills'),
      require.resolve('./globals'),
    ],
    manager: [
      require.resolve('./polyfills'),
      path.resolve(__dirname, '../../client/manager'),
    ],
  };

  const config = {
    bail: true,
    devtool: '#cheap-module-source-map',
    entry: entries,
    output: {
      filename: 'static/[name].bundle.js',
      // Here we set the publicPath to ''.
      // This allows us to deploy storybook into subpaths like GitHub pages.
      // This works with css and image loaders too.
      // This is working for storybook since, we don't use pushState urls and
      // relative URLs works always.
      publicPath: '',
    },
    plugins: [
      new webpack.DefinePlugin(loadEnv({ production: true })),
      new webpack.optimize.DedupePlugin(),
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

  // Webpack 2 doesn't have a OccurenceOrderPlugin plugin in the production mode.
  // But webpack 1 has it. That's why we do this.
  if (OccurenceOrderPlugin) {
    config.plugins.unshift(new OccurenceOrderPlugin());
  }

  return config;
}
