import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../other_components/**/*.stories.?(ts|tsx|js|jsx)',
    {
      directory: '../../../packages/react-native-ui',
      titlePrefix: 'react-native-ui',
      files: '**/*.stories.?(ts|tsx|js|jsx)',
    },
  ],
  addons: [
    { name: '@storybook/addon-ondevice-controls' },
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
    'storybook-addon-deep-controls',
    './local-addon-example',
  ],
  reactNative: {
    playFn: false,
  },

  framework: '@storybook/react-native',
};

export default main;
