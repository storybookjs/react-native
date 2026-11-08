import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { Appearance } from 'react-native';

const preview = {
  // Legacy decorator from the deprecated addon. It renders the story unchanged now.
  decorators: [withBackgrounds],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    hideFullScreenButton: false,
    noSafeArea: false,
    my_param: 'anything',
    layout: 'padded',
    storybookUIVisibility: 'visible',
    // Legacy backgrounds shape, still understood by the built-in Backgrounds panel.
    // The current shape is `options` plus `initialGlobals.backgrounds`, see ../.rnstorybook/preview.tsx.
    backgrounds: {
      default: Appearance.getColorScheme() === 'dark' ? 'dark' : 'plain',
      values: [
        { name: 'dark', value: '#333' },
        { name: 'plain', value: '#fff' },
        { name: 'app', value: '#eeeeee' },
      ],
    },
  },
};

export default preview;
