import fs from 'fs';
import path from 'path';
import { logger } from '@storybook/node-logger';

function resolveTsConfig(tsConfigPath: string): string | undefined {
  if (fs.existsSync(tsConfigPath)) {
    logger.info('=> Found custom tsconfig.json');
    return tsConfigPath;
  }
  return undefined;
}

export default function(configDir: string) {
  const configFilePath = resolveTsConfig(path.resolve(configDir, 'tsconfig.json'));
  return {
    transpileOnly: true,
    configFile: configFilePath || undefined,
  };
}
