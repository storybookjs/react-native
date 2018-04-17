import path from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { includePaths, excludePaths } from './utils';

const getConfig = options => {
  const config = {
    mode: 'production',
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
      new Dotenv({ silent: true }),
    ],
    module: {
      rules: [
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
              loader: require.resolve('html-loader'),
            },
            {
              loader: require.resolve('markdown-loader'),
            },
          ],
        },
      ],
    },
  };

  return config;
};

export default getConfig;
