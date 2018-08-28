const defaultWebpackConfig = require('./dist/server/config/defaults/webpack.config');
const serverUtils = require('./dist/server/utils');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');

module.exports = Object.assign({}, defaultWebpackConfig, buildStatic, buildDev, serverUtils);
