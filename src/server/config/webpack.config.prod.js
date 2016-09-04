import path from 'path';
import webpack from 'webpack';
import { OccurenceOrderPlugin, includePaths, excludePaths } from './utils';
import babalLoaderConfig from './babel.prod.js';

const entries = {
  preview: [
    require.resolve('./polyfills'),
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
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
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
        query: babalLoaderConfig,
        include: includePaths,
        exclude: excludePaths,
      },
    ],
  },
};

// Webpack 2 doesn't have a OccurenceOrderPlugin plugin in the production mode.
// But webpack 1 has it. That's why we do this.
if (OccurenceOrderPlugin) {
  config.plugins.unshift(new OccurenceOrderPlugin());
}

export default config;
