/* eslint-disable import/no-extraneous-dependencies */
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  watchFolders: [
    // The monorepo
    path.resolve(__dirname, '../..'),
  ],
  // transformer: {
  //   getTransformOptions: async () => ({
  //     transform: {
  //       experimentalImportSupport: true,
  //       inlineRequires: true,
  //     },
  //   }),
  // },
  resolver: {
    blacklistRE: blacklist([
      // exclude react-native modules outside of this package
      /app\/.*\/node_modules\/react-native\/.*/,
      /examples\/native\/.*/,
      /examples\/crna-kitchen-sink\/.*/,
      /addons\/.*\/node_modules\/react-native\/.*/,
      /node_modules\/.*\/node_modules\/react-native\/.*/,
      // duplicate packages in server mocks. We don't need them so it's safe to exclude.
      /__mocks__\/.*/,
    ]),
    extraNodeModules: {
      // resolve react-native to this package's node_modules
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
    // resolveRequest: (context, realModuleName, platform, moduleName) => {
    //   console.log({ realModuleName, moduleName });

    //   return {
    //     filePath: require.resolve(__dirname, moduleName),
    //     type: 'sourceFile',
    //   };
    // },
  },
};
