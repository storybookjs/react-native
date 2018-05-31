import fs from 'fs';
import path from 'path';

import { logger } from '@storybook/node-logger';

export const includePaths = [path.resolve('./')];

export const excludePaths = [path.resolve('node_modules')];

export const nodeModulesPaths = path.resolve('./node_modules');

export const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(p => path.resolve('./', p));

// Load environment variables starts with STORYBOOK_ to the client side.
export function loadEnv(options = {}) {
  const defaultNodeEnv = options.production ? 'production' : 'development';
  const env = {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || defaultNodeEnv),
    // This is to support CRA's public folder feature.
    // In production we set this to dot(.) to allow the browser to access these assests
    // even when deployed inside a subpath. (like in GitHub pages)
    // In development this is just empty as we always serves from the root.
    PUBLIC_URL: JSON.stringify(options.production ? '.' : ''),
  };

  Object.keys(process.env)
    .filter(name => /^STORYBOOK_/.test(name))
    .forEach(name => {
      env[name] = JSON.stringify(process.env[name]);
    });

  return {
    'process.env': env,
  };
}

export function getEntries(configDir) {
  const preview = [require.resolve('./polyfills'), require.resolve('./globals')];
  const manager = [require.resolve('./polyfills'), require.resolve('../../client/manager')];

  // Check whether a config.js file exists inside the storybook
  // config directory and throw an error if it's not.
  const storybookConfigPath = path.resolve(configDir, 'config.js');
  if (!fs.existsSync(storybookConfigPath)) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.js".`);
  }

  preview.push(require.resolve(storybookConfigPath));

  // Check whether addons.js file exists inside the storybook.
  const storybookCustomAddonsPath = path.resolve(configDir, 'addons.js');
  if (fs.existsSync(storybookCustomAddonsPath)) {
    logger.info('=> Loading custom addons config.');
    manager.unshift(storybookCustomAddonsPath);
  }

  return { preview, manager };
}
