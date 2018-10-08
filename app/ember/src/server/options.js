import packageJson from '../../package.json';

export default {
  packageJson,
  defaultConfigName: 'ember-cli',
  frameworkPresets: [require.resolve('./framework-preset-babel-ember.js')],
};
