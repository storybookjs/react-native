const packageJson = require('../../package.json');

export default {
  packageJson,
  frameworkPresets: [
    require.resolve('./framework-preset-react.js'),
    require.resolve('./framework-preset-cra.js'),
    require.resolve('./framework-preset-react-docgen.js'),
  ],
};
