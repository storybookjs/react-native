// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const { withStorybook } = require('@storybook/react-native/withStorybook');

module.exports = withStorybook(config, {
  websockets: 'auto',
  experimental_mcp: true,
  liteMode: true,
});
