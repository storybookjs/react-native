const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: ['./'],
  moduleDirectories: ['node_modules', 'src'],
};
