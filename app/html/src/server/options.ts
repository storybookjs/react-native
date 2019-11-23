// tslint:disable-next-line: no-var-requires
const packageJson = require('../../package.json');

export default {
  packageJson,
  framework: 'html',
  frameworkPresets: [require.resolve('./framework-preset-html.js')],
};
