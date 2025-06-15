// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(projectRoot);

defaultConfig.watchFolders = [workspaceRoot];

defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

const withStorybook = require('@storybook/react-native/metro/withStorybook');

const storybookOptions = {
  websockets: {
    port: 7007,
    host: 'localhost',
  },
};

module.exports = withStorybook(defaultConfig, storybookOptions);

/* , {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.rnstorybook'),
  // websockets: {
  // port: 7007,
  // host: '192.x.x.x',
  // host: 'localhost',
  // },
} */
