const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  watchFolders: [
    // The monorepo
    path.resolve(__dirname, '../..'),
  ],
  resolver: {
    blacklistRE: blacklist([
      // exclude react-native modules outside of this package
      /app\/.*\/node_modules\/react-native\/.*/,
      /node_modules\/.*\/node_modules\/react-native\/.*/,
      // duplicate packages in server mocks. We don't need them so it's safe to exclude.
      /__mocks__\/.*/,
    ]),
    extraNodeModules: {
      // resolve react-native to this package's node_modules
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
  },
};
