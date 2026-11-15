import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['./stories/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-actions'],
};

export default main;
