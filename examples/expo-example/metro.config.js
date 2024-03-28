// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const defaultConfig = getDefaultConfig(__dirname);

const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

defaultConfig.transformer.unstable_allowRequireContext = true;

defaultConfig.watchFolders.push('../../packages/react-native-ui');

// causing breakage :(
// defaultConfig.resolver.disableHierarchicalLookup = true;

module.exports = defaultConfig;
