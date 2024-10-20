import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../packages/react-native-ui/**/*.stories.?(ts|tsx|js|jsx)',
    {
      directory: '../other_components',
      files: '**/*.stories.?(ts|tsx|js|jsx)',
      titlePrefix: 'OtherComponents',
    },
    // {
    //   directory: '../other_components',
    //   files: '**/*.storiesof.?(ts|tsx|js|jsx)',
    //   titlePrefix: 'OtherComponents',
    // },
    // '../components/**/*.storiesof.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
    'storybook-addon-deep-controls',
  ],
  reactNative: {
    playFn: false,
  },
};

export default main;
