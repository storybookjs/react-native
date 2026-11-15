import { defineMain } from '@storybook/react-native/node';

export default defineMain({
  stories: ['../../expo-example/components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: [
    { name: '@storybook/addon-ondevice-controls' },
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
    'storybook-addon-deep-controls',
  ],

  storySorts: [
    {
      method: 'alphabetical',
      includeNames: true,
      order: ['ControlExamples', ['ControlExample'], 'InteractionExample', 'DeepControls'],
    },
  ],
  features: {
    ondeviceBackgrounds: true,
  },
  framework: '@storybook/react-native',
});
