import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import { satisfies } from 'semver';
import { sync as resolveSync } from 'resolve';

import { logger } from '@storybook/node-logger';

function removeReactHmre(presets) {
  const index = presets.indexOf('react-hmre');
  if (index > -1) {
    presets.splice(index, 1);
  }
}

// Tries to load a .babelrc and returns the parsed object if successful
function loadFromPath(babelConfigPath) {
  let config;
  const error = {};

  if (fs.existsSync(babelConfigPath)) {
    const content = fs.readFileSync(babelConfigPath, 'utf-8');

    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      config = require(babelConfigPath);
      logger.info('=> Loading custom babel config as JS');
    } catch (e) {
      error.js = e;
    }
    try {
      config = JSON5.parse(content);
      logger.info('=> Loading custom babel config');
    } catch (e) {
      error.json = e;
    }

    if (!config) {
      logger.error(`=> Error parsing babel config file: ${babelConfigPath}
      
      We tried both loading as JS & JSON, neither worked.
      Maybe there's a syntax error in the file?`);
      logger.error(`=> From JS loading we got: ${error.js.message}`);
      logger.error(`=> From JSON loading we got: ${error.js.message}`);

      throw error.js;
    }

    config.babelrc = false;
  }

  if (!config) return null;

  // Remove react-hmre preset.
  // It causes issues with react-storybook.
  // We don't really need it.
  // Earlier, we fix this by running storybook in the production mode.
  // But, that hide some useful debug messages.
  if (config.presets) {
    removeReactHmre(config.presets);
  }

  if (config.env && config.env.development && config.env.development.presets) {
    removeReactHmre(config.env.development.presets);
  }

  return config;
}

function isBabelLoader8() {
  try {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const babelLoaderPkg = require(resolveSync('babel-loader/package.json', {
      basedir: process.cwd(),
    }));
    return satisfies(babelLoaderPkg.version, '>=8.0.0-0');
  } catch (e) {
    return false;
  }
}

export default async function(configDir, getDefaultConfig) {
  const projectRoot = process.cwd();
  const babelConfig =
    loadFromPath(path.resolve(configDir, '.babelrc')) ||
    loadFromPath(path.resolve(projectRoot, 'babel.config.js'));

  if (babelConfig) {
    // If the custom config uses babel's `extends` clause, then replace it with
    // an absolute path. `extends` will not work unless we do this.
    if (babelConfig.extends) {
      babelConfig.extends = path.resolve(configDir, babelConfig.extends);
    }
    return babelConfig;
  }

  return isBabelLoader8() ? getDefaultConfig() : {};
}
