// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('metro-config');
const path = require('path');
const defaultConfig = getDefaultConfig(__dirname);

// const { writeRequires } = require('@storybook/react-native/scripts/loader');
const { generate } = require('@storybook/react-native/scripts/generate');

module.exports = (async () => {
  // writeRequires({
  //   configPath: path.resolve(__dirname, './.storybook'),
  //   unstable_useRequireContext: false,
  // });
  generate({
    configPath: path.resolve(__dirname, './.storybook'),
  });

  return mergeConfig(defaultConfig, {
    resolver: {
      // unstable_enablePackageExports: true,
      disableHierarchicalLookup: true,
      unstable_enableSymlinks: true,
      resolveRequest: (context, moduleName, platform) => {
        const defaultResolveResult = context.resolveRequest(context, moduleName, platform);

        if (
          process.env.STORYBOOK_ENABLED !== 'true' &&
          defaultResolveResult?.filePath?.includes?.('.storybook/')
        ) {
          return {
            type: 'empty',
          };
        }

        return defaultResolveResult;
      },
    },
    transformer: {
      unstable_allowRequireContext: true,
    },
  });
})();
