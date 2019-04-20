import packageJson from '../../package.json';

export default {
  packageJson,
  frameworkPresets: [
    require.resolve('./framework-preset-angular.js'),
    require.resolve('./framework-preset-angular-cli.js'),
  ],
};
