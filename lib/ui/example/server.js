const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: false,
  historyApiFallback: true,
}).listen(
  9999,
  'localhost',
  err => (err ? console.log(err) : console.log('Listening at http://localhost:9999/')),
);
