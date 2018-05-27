import packageJson from '../../package.json';

import wrapBabelConfig from './wrapBabelConfig';
import wrapDefaultBabelConfig from './wrapDefaultBabelConfig';

export default {
  packageJson,
  defaultConfigName: 'create-react-app',
  wrapDefaultBabelConfig,
  wrapBabelConfig,
};
