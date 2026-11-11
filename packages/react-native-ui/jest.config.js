/** @type {import('jest').Config} */
const config = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Reanimated and worklets ship this so jest loads their JS implementations instead of
  // the native ones.
  resolver: 'react-native-reanimated/jest/resolver',
  ...(process.env.JEST_CACHE_DIRECTORY && { cacheDirectory: process.env.JEST_CACHE_DIRECTORY }),
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@gorhom|@storybook|storybook))',
  ],
};
module.exports = config;
