const defaultWebpackConfig = require('./dist/server/config/webpack.config.default');
const serverUtils = require('./dist/server/utils');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');
const mergeBabel = require('./dist/server/mergeBabel');

module.exports = Object.assign({}, defaultWebpackConfig, buildStatic, buildDev, serverUtils, {
  mergeBabel,
});
