import packageJson from '../../package.json';

export default {
  packageJson,
  defaultConfigName: 'create-react-app',
  frameworkPresets: [
    require.resolve('./framework-preset-react.js'),
    require.resolve('./framework-preset-cra.js'),
    require.resolve('./framework-preset-react-docgen.js'),
  ],
};
