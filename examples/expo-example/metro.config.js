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
      // resolverMainFields: ['react-native', 'module', 'browser', 'main'],
      resolveRequest: (context, moduleName, platform) => {
        if (moduleName === '@storybook/addon-actions') {
          const defaultResolveResult = context.resolveRequest(context, moduleName, platform);

          defaultResolveResult.filePath = defaultResolveResult.filePath.replace(
            'index.js',
            'index.mjs'
          );

          return defaultResolveResult;
        }

        return context.resolveRequest(context, moduleName, platform);
      },
      // NOTE from: https://github.com/aws/aws-sdk-js-v3/issues/4877#issuecomment-1803353706
      // if (
      //   moduleName === 'punycode' &&
      //   defaultResolveResult.type === 'sourceFile' &&
      //   defaultResolveResult.filePath?.endsWith('punycode.es6.js')
      // ) {
      //   defaultResolveResult.filePath = defaultResolveResult.filePath.replace(
      //     'punycode.es6.js',
      //     'punycode.js'
      //   );
      // }

      // if (moduleName === 'lru-cache' && defaultResolveResult.filePath?.endsWith('mjs')) {
      //   defaultResolveResult.filePath = defaultResolveResult.filePath.replace('mjs', 'js');
      // }
      // if (moduleName === '@storybook/global') {
      //   console.log('res', defaultResolveResult);
      //   // console.log(defaultResolveResult.filePath);
      //   defaultResolveResult.filePath =
      //     '/Users/danielwilliams/Workspace/storybook/react-native-storybook/node_modules/@storybook/global/dist/index.mjs';
      // }
      // const virtualPath = path.resolve(
      //   __dirname,
      //   'node_modules/.cache/virtual/virtual-module.js'
      // );
      // const fs = require('fs');
      // // Create the virtual module in a generated directory...
      // fs.mkdirSync(path.dirname(virtualPath), { recursive: true });
      // fs.writeFileSync(virtualPath, 'module.exports =  {global: {}};');
      // if (moduleName.startsWith('@storybook/global')) {
      //   // Logic to resolve the module name to a file path...
      //   // NOTE: Throw an error if there is no resolution.

      //   return {
      //     // filePath:
      //     //   '/Users/danielwilliams/Workspace/storybook/react-native-storybook/node_modules/@storybook/global/dist/index.mjs',
      //     // type: 'sourceFile',
      //     filePath: virtualPath,
      //     type: 'sourceFile',
      //   };
      // }

      //   return context.resolveRequest(context, moduleName, platform);
      // },
    },
    transformer: {
      unstable_allowRequireContext: true,
    },
  });
})();
