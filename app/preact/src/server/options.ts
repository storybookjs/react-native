const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'preact',
  frameworkPresets: [require.resolve('./framework-preset-preact.js')],
};
