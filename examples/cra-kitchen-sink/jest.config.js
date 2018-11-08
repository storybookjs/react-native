const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  moduleDirectories: ['node_modules', 'src'],
};
