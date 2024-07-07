// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../');

const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);

defaultConfig.watchFolders = [workspaceRoot];

defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

const withStorybook = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.storybook'),
});
