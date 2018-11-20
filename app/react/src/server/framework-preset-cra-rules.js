import { logger } from '@storybook/node-logger';
import { applyCRAWebpackConfig, isReactScriptsInstalled } from './cra-config';

export function webpackFinal(config) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  logger.info('=> Loading create-react-app config.');

  return applyCRAWebpackConfig(config);
}
