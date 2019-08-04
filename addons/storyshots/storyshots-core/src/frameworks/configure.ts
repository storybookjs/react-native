import fs from 'fs';
import path from 'path';

function getConfigPathParts(configPath: string): string {
  const resolvedConfigPath = path.resolve(configPath);

  if (fs.lstatSync(resolvedConfigPath).isDirectory()) {
    return path.join(resolvedConfigPath, 'config');
  }

  return resolvedConfigPath;
}

function configure(options: { configPath?: string; config: any; storybook: any }): void {
  const { configPath = '.storybook', config, storybook } = options;

  if (config && typeof config === 'function') {
    config(storybook);
    return;
  }

  const resolvedConfigPath = getConfigPathParts(configPath);

  require.requireActual(resolvedConfigPath);
}

export default configure;
