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

defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(context, moduleName, platform);

  if (defaultResolveResult?.filePath?.includes?.('@storybook/react/template/cli')) {
    return {
      type: 'empty',
    };
  }

  return defaultResolveResult;
};

const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

defaultConfig.transformer.unstable_allowRequireContext = true;
defaultConfig.resolver.unstable_enablePackageExports = true;

// causing breakage :(
// defaultConfig.resolver.disableHierarchicalLookup = true;

module.exports = defaultConfig;
