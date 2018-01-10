import fs from 'fs';
import path from 'path';

// avoid ESLint errors
const logger = console;

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
