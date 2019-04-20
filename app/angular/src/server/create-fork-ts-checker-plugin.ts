import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { logger } from '@storybook/node-logger';
import { TsLoaderOptions } from '.';

export default function(tsLoaderOptions: TsLoaderOptions) {
  if (tsLoaderOptions && tsLoaderOptions.configFile) {
    return new ForkTsCheckerWebpackPlugin({
      tsconfig: tsLoaderOptions.configFile,
      async: false,
    });
  }

  logger.info('=> Using default options for ForkTsCheckerWebpackPlugin');
  return new ForkTsCheckerWebpackPlugin();
}
