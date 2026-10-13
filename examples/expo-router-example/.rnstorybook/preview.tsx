import { definePreview } from '@storybook/react-native';

export default definePreview({
  addons: [],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'padded',
  },
});
