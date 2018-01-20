const assign = require('babel-runtime/core-js/object/assign').default;
const client = require('./dist/client').default;

module.exports = assign({}, client, {
  managerPath: require.resolve('./dist/client/manager'),
});
