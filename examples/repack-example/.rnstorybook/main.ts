import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../../expo-example/components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    { name: '@storybook/addon-ondevice-controls' },
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
    'storybook-addon-deep-controls',
  ],

  features: {
    ondeviceBackgrounds: true,
  },
  framework: '@storybook/react-native',
};

export default main;
