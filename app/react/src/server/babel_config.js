import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import { logger } from '@storybook/node-logger';
import defaultConfig from './config/babel';

function removeReactHmre(presets) {
  const index = presets.indexOf('react-hmre');
  if (index > -1) {
    presets.splice(index, 1);
  }
}

// Tries to load a .babelrc and returns the parsed object if successful
function loadFromPath(babelConfigPath) {
  let config;
  if (fs.existsSync(babelConfigPath)) {
    const content = fs.readFileSync(babelConfigPath, 'utf-8');
    try {
      config = JSON5.parse(content);
      config.babelrc = false;
      logger.info('=> Loading custom .babelrc');
    } catch (e) {
      logger.error(`=> Error parsing .babelrc file: ${e.message}`);
      throw e;
    }
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

export default function(configDir) {
  let babelConfig = loadFromPath(path.resolve(configDir, '.babelrc'));
  let inConfigDir = true;

  if (!babelConfig) {
    babelConfig = loadFromPath('.babelrc');
    inConfigDir = false;
  }

  if (babelConfig) {
    // If the custom config uses babel's `extends` clause, then replace it with
    // an absolute path. `extends` will not work unless we do this.
    if (babelConfig.extends) {
      babelConfig.extends = inConfigDir
        ? path.resolve(configDir, babelConfig.extends)
        : path.resolve(babelConfig.extends);
    }
  }

  const finalConfig = babelConfig || defaultConfig;
  // Ensure plugins are defined or fallback to an array to avoid empty values.
  const babelConfigPlugins = finalConfig.plugins || [];
  const extraPlugins = [
    [
      require.resolve('babel-plugin-react-docgen'),
      {
        DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES',
      },
    ],
  ];
  // If `babelConfigPlugins` is not an `Array`, calling `concat` will inject it
  // as a single value, if it is an `Array` it will be spreaded.
  finalConfig.plugins = [].concat(babelConfigPlugins, extraPlugins);

  return finalConfig;
}
