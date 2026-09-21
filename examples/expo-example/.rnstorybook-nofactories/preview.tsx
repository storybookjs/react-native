import { Appearance } from 'react-native';

const preview = {
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
        method: 'alphabetical' as const,
        includeNames: true,
        order: ['ControlExamples', ['ControlExample'], 'InteractionExample', 'DeepControls'],
      },
    },
    hideFullScreenButton: false,
    noSafeArea: false,
    my_param: 'anything',
    layout: 'padded',
    storybookUIVisibility: 'visible',
    backgrounds: {
      options: {
        dark: { name: 'dark', value: '#333' },
        light: { name: 'plain', value: '#fff' },
        app: { name: 'app', value: '#eeeeee' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: Appearance.getColorScheme() === 'dark' ? 'dark' : 'plain' },
  },
};

export default preview;
