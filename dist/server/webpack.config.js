'use strict';

var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    admin: ['stack-source-map/register', path.resolve(__dirname, '../client/init_admin')],
    preview: ['stack-source-map/register', 'webpack-hot-middleware/client', path.resolve(__dirname, '../client/init_preview')]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/'
  },
  plugins: [new webpack.optimize.OccurenceOrderPlugin(), new webpack.HotModuleReplacementPlugin()],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: { presets: ['react', 'es2015', 'stage-2'] },
      exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
      include: [path.resolve('./'), __dirname]
    }]
  }
};

// add config path to the entry
var configDir = path.resolve('./.storybook');
var storybookConfigPath = path.resolve(configDir, 'config.js');
if (!fs.existsSync(storybookConfigPath)) {
  console.error('=> Create a storybook config file in ".storybook/config.js".\n');
  process.exit(0);
}
config.entry.preview.push(storybookConfigPath);

// load custom webpack configurations
var customConfigPath = path.resolve(configDir, 'webpack.config.js');
if (fs.existsSync(customConfigPath)) {
  var customConfig = require(customConfigPath);
  if (customConfig.module.loaders) {
    console.log("=> Loading custom webpack loaders.");
    config.module.loaders = config.module.loaders.concat(customConfig.module.loaders);
  }

  if (customConfig.plugins) {
    console.log(" => Loading custom webpack plugins.");
    config.plugins = config.plugins.concat(customConfig.plugins);
  }
}

module.exports = config;