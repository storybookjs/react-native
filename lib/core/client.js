const client = require('./dist/client').default;

module.exports = client;
module.exports.pathToManager = require.resolve('./dist/client/manager');
