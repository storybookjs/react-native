import packageJson from '../../package.json';

export default {
  packageJson,
  defaultConfigName: 'angular-cli',
  frameworkPresets: [
    require.resolve('./framework-preset-angular.js'),
    require.resolve('./framework-preset-angular-cli.js'),
  ],
};
