const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(svelte)$': '<rootDir>/svelte-transform',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'svelte'],
};
