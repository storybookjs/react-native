const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'vue',
  frameworkPresets: [require.resolve('./framework-preset-vue.js')],
};
