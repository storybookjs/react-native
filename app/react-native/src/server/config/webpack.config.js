import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { OccurenceOrderPlugin, includePaths, excludePaths } from './utils';

const getConfig = options => ({
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [require.resolve('../../manager')],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/[name].bundle.js',
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
    new OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: require('./babel.js'), // eslint-disable-line
        include: includePaths,
        exclude: excludePaths,
      },
    ],
  },
});

export default getConfig;
