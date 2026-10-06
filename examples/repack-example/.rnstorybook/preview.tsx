import { Appearance } from 'react-native';
import { definePreview } from '@storybook/react-native';

export default definePreview({
  addons: [],
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
});
