import type { StorybookConfig } from '@storybook/react-native';
const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../../expo-example/components/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  deviceAddons: [
    { name: '@storybook/addon-ondevice-controls' },
    '@storybook/addon-ondevice-actions',
  ],
  framework: '@storybook/react-native',
};

export default main;
