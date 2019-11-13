const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'svelte',
  frameworkPresets: [require.resolve('./framework-preset-svelte.js')],
};
