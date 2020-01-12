import fs from 'fs';
import { logger } from '@storybook/node-logger';

type PresetOptions = {
  backgrounds?: any;
  viewport?: any;
};

let packageJson: any = {};
if (fs.existsSync('./package.json')) {
  try {
    packageJson = JSON.parse(fs.readFileSync('./package.json').toString());
  } catch (err) {
    logger.error(`Error reading package.json: ${err.message}`);
  }
}

const isInstalled = (addon: string) => {
  const { dependencies, devDependencies } = packageJson;
  return (dependencies && dependencies[addon]) || (devDependencies && devDependencies[addon]);
};

const makeAddon = (key: string) => `@storybook/addon-${key}`;

export function managerEntries(entry: any[] = [], options: PresetOptions = {}) {
  const registerAddons = ['backgrounds', 'viewport']
    .filter(key => (options as any)[key] !== false)
    .map(key => makeAddon(key))
    .filter(addon => !isInstalled(addon))
    .map(addon => `${addon}/register`);
  return [...entry, ...registerAddons];
}
