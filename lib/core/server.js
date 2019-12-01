const defaultWebpackConfig = require('./dist/server/preview/base-webpack.config');
const serverUtils = require('./dist/server/utils/template');
const buildStatic = require('./dist/server/build-static');
const buildDev = require('./dist/server/build-dev');
const toRequireContext = require('./dist/server/preview/to-require-context');

const managerPreset = require.resolve('./dist/server/manager/manager-preset');

module.exports = {
  managerPreset,
  ...defaultWebpackConfig,
  ...buildStatic,
  ...buildDev,
  ...serverUtils,
  ...toRequireContext,
};
