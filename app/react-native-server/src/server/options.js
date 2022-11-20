import packageJson from '../../package.json';

function extendOptions(options, extendServer) {
  const { manualId, https: secured, host, port } = options;
  const storybookOptions = { manualId, secured, host, port };
  const corePresets = [
    {
      name: '@storybook/manager-webpack4/manager-preset',
      options: { managerEntry: require.resolve('../client/manager') },
    },
    {
      name: require.resolve('./rn-options-preset.js'),
      options: { storybookOptions },
    },
  ];

  return {
    ...options,
    framework: 'react-native',
    // debugWebpack: true,
    managerCache: false,
    extendServer,
    packageJson,
    mode: 'dev',
    ignorePreview: true,
    corePresets,
  };
}

export default extendOptions;
