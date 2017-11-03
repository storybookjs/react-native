const path = require('path');

module.exports = {
  entry: './src/polymer-playground-app.html',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        use: [{ loader: 'polymer-webpack-loader' }],
      },
    ],
  },
  devServer: { historyApiFallback: true },
  devtool: 'eval-source-map',
};
