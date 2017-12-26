import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { OccurenceOrderPlugin, includePaths, excludePaths } from './utils';

const getConfig = options => {
  const config = {
    bail: true,
    devtool: '#cheap-module-source-map',
    entry: {
      manager: [path.resolve(__dirname, '../../manager')],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
      // Here we set the publicPath to ''.
      // This allows us to deploy storybook into subpaths like GitHub pages.
      // This works with css and image loaders too.
      // This is working for storybook since, we don't use pushState urls and
      // relative URLs works always.
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        data: {
          options: JSON.stringify(options),
        },
        template: require.resolve('../index.html.ejs'),
      }),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
      new webpack.optimize.DedupePlugin(),
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          ie8: false,
          mangle: false,
          warnings: false,
          output: {
            comments: false,
          },
        },
      }),
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
        query: require('./babel.prod.js'), // eslint-disable-line
          include: includePaths,
          exclude: excludePaths,
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader',
            },
            {
              loader: 'markdown-loader',
            },
          ],
        },
      ],
    },
  };

  // Webpack 2 doesn't have a OccurenceOrderPlugin plugin in the production mode.
  // But webpack 1 has it. That's why we do this.
  if (OccurenceOrderPlugin) {
    config.plugins.unshift(new OccurenceOrderPlugin());
  }

  return config;
};

export default getConfig;
