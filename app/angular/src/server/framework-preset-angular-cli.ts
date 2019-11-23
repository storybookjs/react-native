import { Configuration } from 'webpack';
import { Path } from '@angular-devkit/core';
import { logger } from '@storybook/node-logger';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';

export function webpackFinal(config: Configuration) {
  const cwd = process.cwd() as Path;
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(cwd);
  logger.info('=> Loading angular-cli config.');

  return applyAngularCliWebpackConfig(config, cliWebpackConfigOptions);
}
