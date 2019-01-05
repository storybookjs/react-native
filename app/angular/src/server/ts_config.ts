import fs from 'fs';
import path from 'path';
import { logger } from '@storybook/node-logger';
import { Options } from 'ts-loader';

function resolveTsConfig(tsConfigPath: string) {
  if (!fs.existsSync(tsConfigPath)) {
    return null;
  }

  logger.info('=> Found custom tsconfig.json');

  return tsConfigPath;
}

export default function(configDir: string): Partial<Options> {
  const tsLoaderOptions: Partial<Options> = {
    transpileOnly: true,
  };
  const configFilePath = resolveTsConfig(path.resolve(configDir, 'tsconfig.json'));

  if (configFilePath) {
    tsLoaderOptions.configFile = configFilePath;
  }

  return tsLoaderOptions;
}
