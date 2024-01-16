/** @type{import("expo/config").ExpoConfig} */
module.exports = {
  name: 'Expo Example',
  slug: 'expo-example',
  web: {
    bundler: 'metro',
  },
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
  },
  userInterfaceStyle: 'automatic',
};
