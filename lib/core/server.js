const defaultWebpackConfig = require('./dist/server/preview/base-webpack.config');
const serverUtils = require('./dist/server/utils/template');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');
const devServer = require('./dist/server/dev-server').default;

const managerPreset = require.resolve('./dist/server/manager/manager-preset');

module.exports = Object.assign(
  { devServer, managerPreset },
  defaultWebpackConfig,
  buildStatic,
  buildDev,
  serverUtils
);
