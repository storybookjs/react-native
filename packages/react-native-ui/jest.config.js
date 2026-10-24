/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  ...(process.env.JEST_CACHE_DIRECTORY && { cacheDirectory: process.env.JEST_CACHE_DIRECTORY }),
  transform: {
    '\\.[jt]sx?$': '<rootDir>/jest-sucrase-transformer.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(storybook)/)'],
};
module.exports = config;
