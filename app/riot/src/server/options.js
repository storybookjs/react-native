import packageJson from '../../package.json';

export default {
  packageJson,
  framework: 'riot',
  frameworkPresets: [require.resolve('./framework-preset-riot.js')],
};
