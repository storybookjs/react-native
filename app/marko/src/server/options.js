import packageJson from '../../package.json';

export default {
  packageJson,
  framework: 'marko',
  frameworkPresets: [require.resolve('./framework-preset-marko.js')],
};
