// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = ['../../', '.storybook', __dirname];

config.resolver.resolverMainFields = ['sbmodern', ...config.resolver.resolverMainFields];

module.exports = config;
