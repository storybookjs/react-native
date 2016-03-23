var config = require('./webpack.config');
var path = require('path');
var fs = require('fs');

var configDir = path.resolve('./.storybook');
var customConfigPath = path.resolve(configDir, 'webpack.config.js');

if (fs.existsSync(customConfigPath)) {
  var customConfig = require(customConfigPath);
  if (customConfig.module.loaders) {
    console.log("=> Loading custom webpack loaders");
    config.module.loaders =
      config.module.loaders.concat(customConfig.module.loaders);
  }

  if (customConfig.plugins) {
    console.log(" => Loading custom webpack plugins");
    config.plugins = config.plugins.concat(customConfig.plugins);
  }
}

module.exports = config;
