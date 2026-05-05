export default {
  stories: ['**/*.stories.tsx'],
  reactNativeOptions: {
    excludePaths: '**/exclude-components/**',
  },
  deviceAddons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
