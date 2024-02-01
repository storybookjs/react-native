import type { StorybookConfig } from '@storybook/react-webpack5';
import { join, dirname } from 'path';
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

type ServerStorybookConfig = StorybookConfig & {
  reactNativeServerOptions: { host: string; port: number };
};

const main: ServerStorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    '@storybook/addon-react-native-web',
    // note why does this break with get absolute?
    '@storybook/addon-react-native-server',
  ],
  // logLevel: 'debug',
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  reactNativeServerOptions: {
    host: 'localhost',
    port: 7007,
  },

  // docs: {
  //   autodocs: 'tag',
  // },
};

export default main;
