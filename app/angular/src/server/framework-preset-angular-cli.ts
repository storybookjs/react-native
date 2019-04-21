import { logger } from '@storybook/node-logger';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';
import { WebpackConfig } from '.';
import { Path } from '@angular-devkit/core';

export function webpackFinal(config: WebpackConfig) {
  const cwd = process.cwd() as Path;
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(cwd);

  if (cliWebpackConfigOptions) {
    logger.info('=> Loading angular-cli config.');
  }

  return applyAngularCliWebpackConfig(config, cliWebpackConfigOptions);
}
