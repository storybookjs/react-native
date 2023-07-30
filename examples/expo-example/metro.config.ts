// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from 'expo/metro-config';
import { mergeConfig } from 'metro-config';
const defaultConfig = getDefaultConfig(__dirname);

const config = mergeConfig(defaultConfig, {
  watchFolders: ['../../', '.storybook', __dirname],
  resolver: { resolverMainFields: ['sbmodern', ...defaultConfig.resolver.resolverMainFields] },
  transformer: {
    unstable_allowRequireContext: true,
  },
});

module.exports = config;
