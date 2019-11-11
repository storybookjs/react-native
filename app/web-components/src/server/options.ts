// tslint:disable-next-line: no-var-requires
const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'web-components',
  frameworkPresets: [require.resolve('./framework-preset-web-components.js')],
};
