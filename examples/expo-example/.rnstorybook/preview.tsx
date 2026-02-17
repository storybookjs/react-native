import { Appearance } from 'react-native';
import type { Preview } from '@storybook/react-native';
// import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

const preview: Preview = {
  // decorators: [withBackgrounds],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
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
    // backgrounds: {
    //   default: Appearance.getColorScheme() === 'dark' ? 'dark' : 'plain',
    //   values: [
    //     { name: 'plain', value: 'white' },
    //     { name: 'dark', value: '#333' },
    //     { name: 'app', value: '#eeeeee' },
    //   ],
    // },
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
