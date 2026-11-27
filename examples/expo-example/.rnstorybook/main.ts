import { defineMain } from '@storybook/react-native/node';

export default defineMain({
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../other_components/**/*.stories.?(ts|tsx|js|jsx)',
    {
      directory: '../../../packages/react-native-ui',
      titlePrefix: 'react-native-ui',
      files: '**/*.stories.?(ts|tsx|js|jsx)',
    },
  ],
  deviceAddons: [
    'storybook-addon-deep-controls',
    './local-addon-example',
    { name: '@storybook/addon-ondevice-controls' },
    '@storybook/addon-ondevice-actions',
    // '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-notes',
  ],
  storySorts: [
    {
      method: 'alphabetical',
      includeNames: true,
      order: ['ControlExamples', ['ControlExample'], 'InteractionExample', 'DeepControls'],
    },
  ],
  reactNative: {
    playFn: false,
  },
  features: {
    ondeviceBackgrounds: true,
    ondeviceInteractions: true,
  },

  framework: '@storybook/react-native',
});
