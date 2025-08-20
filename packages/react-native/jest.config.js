/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/setup.js'],

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|storybook/.*|@storybook/.*|uuid)',
  ],
};
module.exports = config;
