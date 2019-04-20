import { logger } from '@storybook/node-logger';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';
import { WebpackConfig } from '.';

export function webpackFinal(config: WebpackConfig) {
  const cwd = process.cwd();
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(cwd);

  if (cliWebpackConfigOptions) {
    logger.info('=> Loading angular-cli config.');
  }

  return applyAngularCliWebpackConfig(config, cliWebpackConfigOptions);
}
