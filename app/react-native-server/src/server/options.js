import packageJson from '../../package.json';

function extendOptions(options, extendServer) {
  const { manualId, https: secured, host, port } = options;
  const storybookOptions = { manualId, secured, host, port };

  return {
    ...options,
    framework: 'react-native',
    extendServer,
    packageJson,
    mode: 'dev',
    ignorePreview: true,
    corePresets: [
      {
        name: '@storybook/manager-webpack4/manager-preset',
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
