const { getDefaultConfig } = require('metro-config');

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

module.exports = (async () => {
  const {
    resolver: { resolverMainFields },
    watchFolders,
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    watchFolders: [...watchFolders, path.resolve(__dirname, '../../'), './.storybook'],
    resolver: {
      resolverMainFields: ['sbmodern', ...resolverMainFields],
    },
  };
})();
