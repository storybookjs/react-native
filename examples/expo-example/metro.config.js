// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [
  path.resolve(__dirname, '../../'),
  path.resolve(__dirname, '.storybook'),
  __dirname,
];

config.resolver.resolverMainFields = ['sbmodern', ...config.resolver.resolverMainFields];

module.exports = config;
