const defaultWebpackConfig = require('./dist/server/preview/webpack.config.iframe.default');
const serverUtils = require('./dist/server/utils/template');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');

module.exports = Object.assign({}, defaultWebpackConfig, buildStatic, buildDev, serverUtils);
