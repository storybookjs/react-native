import { logger } from '@storybook/node-logger';

import packageJson from '../../package.json';

import wrapInitialConfig from './wrapInitialConfig';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';

const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(process.cwd());

if (cliWebpackConfigOptions) {
  logger.info('=> Loading angular-cli config.');
}

export default {
  packageJson,
  defaultConfigName: 'angular-cli',
  wrapInitialConfig,
  wrapDefaultConfig: config => applyAngularCliWebpackConfig(config, cliWebpackConfigOptions),
  wrapBasicConfig: config => applyAngularCliWebpackConfig(config, cliWebpackConfigOptions),
};
