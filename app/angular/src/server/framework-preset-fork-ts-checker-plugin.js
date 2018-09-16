import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { logger } from '@storybook/node-logger';

export default function(tsLoaderOptions) {
  if (tsLoaderOptions && tsLoaderOptions.configFile) {
    return new ForkTsCheckerWebpackPlugin({
      tsconfig: tsLoaderOptions.configFile,
    });
  }

  logger.error('Cannot create ForkTsCheckerWebpackPlugin: configFile is missing');
  return null;
}
