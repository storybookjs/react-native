import { logger } from '@storybook/node-logger';

import {
  getAngularCliWebpackConfigOptions,
  applyAngularCliWebpackConfig,
} from './angular-cli_config';

export function webpack(config) {
  const cwd = process.cwd();
  const cliWebpackConfigOptions = getAngularCliWebpackConfigOptions(cwd);

  if (cliWebpackConfigOptions) {
    logger.info('=> Loading angular-cli config.');
  }

  return applyAngularCliWebpackConfig(config, cliWebpackConfigOptions);
}
