import type { StorybookConfig } from '@storybook/react-native-web-vite';

type ServerStorybookConfig = StorybookConfig & {
  reactNativeServerOptions: { host: string; port: number };
};

const main: ServerStorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],

  addons: ['@storybook/addon-react-native-server', 'storybook-addon-deep-controls'],

  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },

  // logLevel: 'debug',

  reactNativeServerOptions: {
    host: 'localhost',
    port: 7007,
  },
};

export default main;
