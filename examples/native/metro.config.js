const {getDefaultConfig} = require('metro-config')

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = (async () => {
  const {
    resolver: {resolverMainFields},
    watchFolders,
  } = await getDefaultConfig()

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    watchFolders: [...watchFolders, './.storybook'],
    resolver: {
      resolverMainFields: [...resolverMainFields, 'sbmodern'],
    },
  }
})()
