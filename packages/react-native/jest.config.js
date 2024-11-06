/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  modulePathIgnorePatterns: ['dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['node_modules/(?!react-native|@react-native)'],
  setupFilesAfterEnv: ['<rootDir>/../../node_modules/react-native-gesture-handler/jestSetup.js'],
  transform: {
    '^.+\\.(js)$': ['babel-jest', { plugins: ['babel-plugin-syntax-hermes-parser'] }],
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
};
module.exports = config;
