import { logger } from '@storybook/node-logger';

import {
  applyAngularCliWebpackConfig,
  getAngularCliWebpackConfigOptions,
} from './angular-cli_config';
import { Configuration } from 'webpack';
import { Path } from '@angular-devkit/core';

export function webpackFinal(config: Configuration) {
  const cwd = process.cwd();
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(cwd as Path);

  if (cliWebpackConfigOptions) {
    logger.info('=> Loading angular-cli config.');
  }

  return applyAngularCliWebpackConfig(config, cliWebpackConfigOptions);
}
