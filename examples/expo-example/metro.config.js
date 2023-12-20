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
      resolverMainFields: ['react-native', 'module', 'browser', 'main'],

      // NOTE from: https://github.com/aws/aws-sdk-js-v3/issues/4877#issuecomment-1803353706
      resolveRequest: (context, moduleName, platform) => {
        // Additional logic here
        const defaultResolveResult = context.resolveRequest(context, moduleName, platform);

        if (
          moduleName === 'punycode' &&
          defaultResolveResult.type === 'sourceFile' &&
          defaultResolveResult.filePath?.endsWith('punycode.es6.js')
        ) {
          defaultResolveResult.filePath = defaultResolveResult.filePath.replace(
            'punycode.es6.js',
            'punycode.js'
          );
        }

        if (moduleName === 'lru-cache' && defaultResolveResult.filePath?.endsWith('mjs')) {
          defaultResolveResult.filePath = defaultResolveResult.filePath.replace('mjs', 'js');
        }
        return defaultResolveResult;
      },
    },
    transformer: {
      unstable_allowRequireContext: true,
    },
  });
})();
