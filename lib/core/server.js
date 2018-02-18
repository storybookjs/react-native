const assign = require('babel-runtime/core-js/object/assign').default;
const defaultWebpackConfig = require('./dist/server/config/defaults/webpack.config');
const WatchMissingNodeModulesPlugin = require('./dist/server/config/WatchMissingNodeModulesPlugin');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');

module.exports = assign({}, defaultWebpackConfig, buildStatic, buildDev, {
  WatchMissingNodeModulesPlugin,
  managerPath: require.resolve('./dist/client/manager'),
});
