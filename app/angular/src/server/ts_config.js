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
  const configFile = resolveTsConfig(path.resolve(configDir, 'tsconfig.json'));

  if (!configFile) {
    return {};
  }

  return {
    configFile,
  };
}
