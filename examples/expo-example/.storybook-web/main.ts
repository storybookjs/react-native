import { join, dirname } from 'path';
// import * as ws from 'ws';
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-react-native-web'),
    // note why does this break with get absolute?
    '@storybook/addon-react-native-server',
  ],
  // logLevel: 'debug',
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },

  reactNativeServerOptions: {
    host: 'localhost',
    port: 7007,
  },

  docs: {
    autodocs: 'tag',
  },
};

export default config;
