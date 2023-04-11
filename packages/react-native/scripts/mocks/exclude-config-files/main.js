module.exports = {
  stories: ['**/*.stories.tsx'],
  reactNativeOptions: {
    excludePaths: '**/exclude-components/**',
  },
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
