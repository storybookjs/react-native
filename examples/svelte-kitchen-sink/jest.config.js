const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(svelte)$': '<rootDir>/node_modules/svelte-jest',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};
