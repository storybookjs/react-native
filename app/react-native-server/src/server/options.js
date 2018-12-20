import { managerPreset } from '@storybook/core/server';
import packageJson from '../../package.json';

function extendOptions(options, extendServer) {
  const { manualId, https: secured, host, port } = options;
  const storybookOptions = { manualId, secured, host, port };

  return {
    ...options,
    extendServer,
    packageJson,
    mode: 'dev',
    ignorePreview: true,
    corePresets: [
      {
        name: managerPreset,
        options: { managerEntry: require.resolve('../client/manager') },
      },
      {
        name: require.resolve('./rn-options-preset.js'),
        options: { storybookOptions },
      },
    ],
  };
}

export default extendOptions;
