import path from 'path';
import webpack from 'webpack';
// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { includePaths, excludePaths } from './utils';

const getConfig = options => ({
  mode: 'development',
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
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    // new WatchMissingNodeModulesPlugin(nodeModulesPaths),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: require('./babel.js'), // eslint-disable-line
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
  optimization: {
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    splitChunks: {
      chunks: 'all',
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },
});

export default getConfig;
