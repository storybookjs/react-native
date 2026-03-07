// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../');
const secureKeyPath = path.resolve(projectRoot, '.certs/storybook-localhost-key.pem');
const secureCertPath = path.resolve(projectRoot, '.certs/storybook-localhost-cert.pem');

const readRequiredTlsFile = (absolutePath, label) => {
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing Storybook TLS ${label} file at ${absolutePath}`);
  }

  return fs.readFileSync(absolutePath);
};

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

const storybookSecured = process.env.EXPO_PUBLIC_STORYBOOK_WS_SECURED === 'true';
const storybookWebsockets = storybookSecured
  ? {
      secured: true,
      key: readRequiredTlsFile(secureKeyPath, 'key'),
      cert: readRequiredTlsFile(secureCertPath, 'cert'),
    }
  : 'auto';

const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const { withRozenite } = require('@rozenite/metro');
module.exports = withRozenite(
  withStorybook(defaultConfig, {
    enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
    websockets: storybookWebsockets,
    experimental_mcp: true,
  }),
  {
    include: ['@dannyhw/rozenite-storybook'],
    enabled: true,
    projectType: 'expo',
  }
);

/* , {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.rnstorybook'),
  // websockets: {
  // port: 7007,
  // host: '192.x.x.x',
  // host: 'localhost',
  // },
} */
