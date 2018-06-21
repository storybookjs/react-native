const assign = require('babel-runtime/core-js/object/assign').default;
const defaultWebpackConfig = require('./dist/server/config/defaults/webpack.config');
const serverUtils = require('./dist/server/utils');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');

module.exports = assign({}, defaultWebpackConfig, buildStatic, buildDev, serverUtils, {
  indexHtmlPath: require.resolve('./src/server/index.html.ejs'),
  iframeHtmlPath: require.resolve('./src/server/iframe.html.ejs'),
});
