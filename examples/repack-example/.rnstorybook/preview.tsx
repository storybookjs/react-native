import { Appearance } from 'react-native';
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        includeNames: true,
        order: ['ControlExamples', ['ControlExample'], 'InteractionExample', 'DeepControls'],
      },
    },
    hideFullScreenButton: false,
    noSafeArea: false,
    my_param: 'anything',
    layout: 'padded', // fullscreen, centered, padded
    storybookUIVisibility: 'visible', // visible, hidden
    backgrounds: {
      options: {
        // 👇 Default options
        dark: { name: 'dark', value: '#333' },
        light: { name: 'plain', value: '#fff' },
        // 👇 Add your own
        app: { name: 'app', value: '#eeeeee' },
      },
    },
  },
  initialGlobals: {
    // 👇 Set the initial background color
    backgrounds: { value: Appearance.getColorScheme() === 'dark' ? 'dark' : 'plain' },
  },
};

export default preview;
