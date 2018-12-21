const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^riot$': 'riot/riot',
  },
  transform: {
    ...config.transform,
    '^.+\\.(tag)$': '<rootDir>/node_modules/riot-jest-transformer',
    '^.+\\.(txt)$': '<rootDir>/node_modules/jest-raw-loader',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'tag'],
};
