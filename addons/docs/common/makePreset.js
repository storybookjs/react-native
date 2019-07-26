const fs = require('fs');
const common = require('./preset');

module.exports = framework => {
  const frameworkConfig = `${__dirname}/../${framework}/config.js`;
  const preconfig = fs.existsSync(frameworkConfig) ? [frameworkConfig] : [];
  function config(entry = []) {
    return [...preconfig, ...entry];
  }

  const configureJSX = framework !== 'react';
  const webpack = (webpackConfig, options) =>
    common.webpack(webpackConfig, { configureJSX, ...options });

  return {
    ...common,
    webpack,
    config,
  };
};
