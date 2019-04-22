import { logger } from '@storybook/node-logger';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';
import { Path } from '@angular-devkit/core';
import { Configuration } from 'webpack';

export function webpackFinal(config: Configuration) {
  const cwd = process.cwd() as Path;
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(cwd);

  if (cliWebpackConfigOptions) {
    logger.info('=> Loading angular-cli config.');
  }

  return applyAngularCliWebpackConfig(config, cliWebpackConfigOptions);
}
