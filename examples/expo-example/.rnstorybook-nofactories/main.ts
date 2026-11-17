import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../components/**/!(*.factories).stories.?(ts|tsx|js|jsx)',
    '../other_components/**/!(*.factories).stories.?(ts|tsx|js|jsx)',
    {
      directory: '../../../packages/react-native-ui',
      titlePrefix: 'react-native-ui',
      files: '**/!(*.factories).stories.?(ts|tsx|js|jsx)',
    },
  ],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    // Backgrounds are built in. The deprecated stub is listed to exercise the legacy
    // `values`/`default` parameters in preview.tsx; it registers nothing.
    '@storybook/addon-ondevice-backgrounds',
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
  reactNative: {
    playFn: false,
  },
  framework: '@storybook/react-native',
};

export default main;
