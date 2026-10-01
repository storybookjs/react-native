import { defineMain } from '@storybook/react-native/node';

export default defineMain({
  stories: ['../../expo-example/components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: [
    { name: '@storybook/addon-ondevice-controls' },
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
    'storybook-addon-deep-controls',
  ],

  features: {
    ondeviceBackgrounds: true,
  },
  framework: '@storybook/react-native',
});
