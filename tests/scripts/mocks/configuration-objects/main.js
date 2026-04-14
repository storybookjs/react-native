export default {
  stories: [
    {
      files: '**/*.stories.tsx',
      directory: './components',
      titlePrefix: 'ComponentsPrefix',
    },
  ],
  deviceAddons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};
