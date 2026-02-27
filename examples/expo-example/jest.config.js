// we use a config file because it resolves rootdir correctly

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  ...(process.env.JEST_CACHE_DIRECTORY && { cacheDirectory: process.env.JEST_CACHE_DIRECTORY }),

  transform: {
    // Use sucrase for storybook ESM files (much faster than babel for simple ESM→CJS)
    'node_modules/(storybook|@storybook/react)/.+\\.[jt]sx?$':
      '<rootDir>/jest-sucrase-transformer.js',
  },

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|jest-expo|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|storybook|@storybook/react|uuid|@react-native/.*)',
  ],
};

module.exports = config;
