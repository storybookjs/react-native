/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/setup.js'],
  ...(process.env.JEST_CACHE_DIRECTORY && { cacheDirectory: process.env.JEST_CACHE_DIRECTORY }),

  transform: {
    'node_modules/(storybook|@storybook/react)/.+\\.[jt]sx?$':
      '<rootDir>/jest-sucrase-transformer.js',
  },

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|jest-expo|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|storybook|@storybook/react|uuid|@react-native/.*)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/scripts/generate\\.test\\.js$'],
};
module.exports = config;
