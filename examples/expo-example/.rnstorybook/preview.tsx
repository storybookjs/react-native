import { Appearance } from 'react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { definePreview } from '@storybook/react-native';

export default definePreview({
  addons: [],
  decorators: [withBackgrounds],

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
    backgrounds: {
      default: Appearance.getColorScheme() === 'dark' ? 'dark' : 'plain',
      // @ts-expect-error - backgrounds not compatible yet
      values: [
        { name: 'plain', value: 'white' },
        { name: 'dark', value: '#333' },
        { name: 'app', value: '#eeeeee' },
      ],
    },
  },
});
