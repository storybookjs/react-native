import fs from 'fs';
import { logger } from '@storybook/node-logger';

type PresetOptions = {
  actions?: any;
  backgrounds?: any;
  knobs?: any;
  links?: any;
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

export function presets(options: PresetOptions = {}) {
  const presetAddons = ['knobs']
    .filter(key => (options as any)[key] !== false)
    .map(key => makeAddon(key))
    .filter(addon => !isInstalled(addon))
    .map(addon => `${addon}/preset`);
  return presetAddons;
}

export function addons(entry: any[] = [], options: PresetOptions = {}) {
  const registerAddons = ['actions', 'backgrounds', 'links', 'viewport']
    .filter(key => (options as any)[key] !== false)
    .map(key => makeAddon(key))
    .filter(addon => !isInstalled(addon))
    .map(addon => `${addon}/register`);
  return [...entry, ...registerAddons];
}
