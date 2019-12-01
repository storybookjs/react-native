import fs from 'fs';
import { logger } from '@storybook/node-logger';
import dedent from 'ts-dedent';

type PresetOptions = {
  actions?: any;
  backgrounds?: any;
  docs?: any;
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

const warnIfInstalled = (addon: string, dependencies?: Record<string, string>) => {
  if (dependencies) {
    const version = dependencies[addon];
    if (version) {
      logger.warn(dedent`
        ${addon}@${version} found in package.json
        Consider removing it from your app or disabling it in addon-essentials
        For more information see the addon-essentials FAQ in its README
      `);
    }
  }
};

const makeAddon = (key: string, options: PresetOptions) => {
  const addon = `@storybook/addon-${key}`;
  const { dependencies, devDependencies } = packageJson;
  warnIfInstalled(addon, devDependencies);
  warnIfInstalled(addon, dependencies);
  return addon;
};

export const presets = (options: PresetOptions = {}) => {
  const presetAddons = ['docs', 'knobs']
    .filter(key => (options as any)[key] !== null)
    .map(key => makeAddon(key, options))
    .map(addon => ({
      name: `${addon}/preset`,
      options: (options as any)[addon] || {},
    }));
  return presetAddons;
};

export function addons(entry: any[] = [], options: PresetOptions = {}) {
  const registerAddons = ['actions', 'backgrounds', 'links', 'viewport']
    .filter(key => (options as any)[key] !== null)
    .map(key => makeAddon(key, options))
    .map(addon => `${addon}/register`);
  return [...entry, ...registerAddons];
}
