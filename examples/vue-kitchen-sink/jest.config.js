const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'vue'],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    // TMP: disable MDX until we upgrade vue-kitchen-sink to latest
    '\\.mdx': '<rootDir>/__mocks__/fileMock.js',
  },
};
