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
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    '@storybook/addon-react-native-web',
    // note why does this break with get absolute?
    '@storybook/addon-react-native-server',
    'storybook-addon-deep-controls',
  ],
  // logLevel: 'debug',
  framework: getAbsolutePath('@storybook/react-webpack5'),

  reactNativeServerOptions: {
    host: 'localhost',
    port: 7007,
  },
};

export default main;
