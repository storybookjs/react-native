import packageJson from '../../package.json';

export default {
  packageJson,
  framework: 'rax',
  frameworkPresets: [require.resolve('./framework-preset-rax.js')],
};
