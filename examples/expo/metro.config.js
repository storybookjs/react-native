const path = require('path');

module.exports = {
  watchFolders: [
    // The monorepo
    path.resolve(__dirname, '../../app/react-native'),
  ],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
      }
    ),
  },
  // resolver: {
  //   extraNodeModules: {
  //     // resolve react-native to this package's node_modules
  //     'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  //     '@storybook/react-native': path.resolve(__dirname, '../../app/react-native'),
  //   },
  // },
};
