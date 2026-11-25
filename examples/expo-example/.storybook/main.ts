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

  // react-native-svg's web build imports getAssetByID from
  // @react-native/assets-registry, which react-native no longer installs
  // (0.87+). Point it at react-native-web's registry, which is the one that
  // actually gets populated on web.
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      resolve: {
        alias: [
          {
            find: /^@react-native\/assets-registry\/registry$/,
            replacement: 'react-native-web/dist/modules/AssetRegistry',
          },
        ],
      },
    });
  },

  // logLevel: 'debug',

  reactNativeServerOptions: {
    host: 'localhost',
    port: 7007,
  },
};

export default main;
