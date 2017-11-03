const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/polymer-playground-app.html',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash:8].js',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        exclude: require.resolve('./index.html'),
        use: [{ loader: 'babel-loader' }, { loader: 'polymer-webpack-loader' }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents*.js', flatten: true },
      { from: 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js' },
    ]),
  ],
  devServer: { historyApiFallback: true },
  devtool: 'eval-source-map',
};
