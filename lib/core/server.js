const assign = require('babel-runtime/core-js/object/assign').default;
const defaultWebpackConfig = require('./dist/server/config/defaults/webpack.config');
const configLoaderCreator = require('./dist/server/config').default;
const serverUtils = require('./dist/server/utils');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');

module.exports = assign({}, defaultWebpackConfig, buildStatic, buildDev, serverUtils, {
  managerPath: require.resolve('./dist/client/manager'),
  configLoaderCreator,
});
