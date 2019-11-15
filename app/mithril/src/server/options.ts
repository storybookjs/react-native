import packageJson from '../../package.json';

export default {
  packageJson,
  framework: 'mithril',
  frameworkPresets: [require.resolve('./framework-preset-mithril.js')],
};
