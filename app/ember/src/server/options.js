import packageJson from '../../package.json';

export default {
  packageJson,
  framework: 'ember',
  frameworkPresets: [require.resolve('./framework-preset-babel-ember.js')],
};
