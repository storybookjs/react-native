import fs from 'fs';
import path from 'path';
import { logger } from '@storybook/node-logger';

function resolveTsConfig(tsConfigPath) {
  if (!fs.existsSync(tsConfigPath)) {
    return null;
  }

  logger.info('=> Found custom tsconfig.json');

  return tsConfigPath;
}

export default function(configDir) {
  const tsLoaderOptions = {
    transpileOnly: true,
  };
  const configFilePath = resolveTsConfig(path.resolve(configDir, 'tsconfig.json'));

  if (configFilePath) {
    tsLoaderOptions.configFile = configFilePath;
  }

  return tsLoaderOptions;
}
