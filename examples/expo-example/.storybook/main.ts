import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { join, dirname } from 'path';

type ServerStorybookConfig = StorybookConfig & {
  reactNativeServerOptions: { host: string; port: number };
};

const main: ServerStorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],

  addons: [
    '@storybook/addon-essentials',
    // note why does this break with get absolute?
    '@storybook/addon-react-native-server',
    'storybook-addon-deep-controls',
  ],

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
