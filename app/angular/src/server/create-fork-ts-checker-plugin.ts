import { logger } from '@storybook/node-logger';
import { Options } from 'ts-loader';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as ForkTs from 'fork-ts-checker-webpack-plugin';

export function createForkTsCheckerInstance(tsLoaderOptions: Partial<Options>): ForkTs {
  if (tsLoaderOptions && tsLoaderOptions.configFile) {
    return new ForkTsCheckerWebpackPlugin({
      tsconfig: tsLoaderOptions.configFile,
      async: false,
    });
  }

  logger.info('=> Using default options for ForkTsCheckerWebpackPlugin');
  return new ForkTsCheckerWebpackPlugin();
}
export default createForkTsCheckerInstance;
