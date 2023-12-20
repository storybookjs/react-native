import packageJson from '../../package.json';
import { RNServerCLIOptions } from './cli';
import { LoadOptions } from '@storybook/types';
// import path from 'path';

function extendOptions(options: RNServerCLIOptions, extendServer: LoadOptions['extendServer']) {
  const { manualId, https: secured, host, port } = options;

  const storybookOptions = { manualId, secured, host, port };

  // const config = require(path.join(options.configDir, 'main'));
  // const useWebpack5 = config.core?.builder === 'webpack5';

  return {
    ...options,
    framework: 'react-native',
    extendServer,
    packageJson,
    ignorePreview: true,
    previewUrl: 'https://example.com',
    corePresets: [
      // {
      //   name: `@storybook/manager-webpack${useWebpack5 ? 5 : 4}/manager-preset`,
      //   options: { managerEntry: require.resolve('../client/manager') },
      // },
      {
        name: require.resolve('./rn-options-preset'),
        options: { storybookOptions },
      },
    ],
  } as RNServerCLIOptions;
}

export default extendOptions;
