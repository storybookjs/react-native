const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  moduleDirectories: ['<rootDir>/node_modules', 'src'],
};
