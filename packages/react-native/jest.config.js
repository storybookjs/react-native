/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/setup.js'],

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|jest-expo|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|storybook/.*|@storybook/.*|uuid|@react-native/.*)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/scripts/generate\\.test\\.js$'],
};
module.exports = config;
