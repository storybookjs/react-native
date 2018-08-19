import packageJson from '../../package.json';

import wrapDefaultBabelConfig from './wrapDefaultBabelConfig';

export default {
  packageJson,
  defaultConfigName: 'create-react-app',
  frameworkPresets: [require.resolve('./framework-preset-react.js')],
  wrapDefaultBabelConfig,
};
