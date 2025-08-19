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

const { withStorybookConfig } = require('@storybook/react-native/metro/withStorybookConfig');

module.exports = withStorybookConfig(defaultConfig);

/* , {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.rnstorybook'),
  // websockets: {
  // port: 7007,
  // host: '192.x.x.x',
  // host: 'localhost',
  // },
} */
