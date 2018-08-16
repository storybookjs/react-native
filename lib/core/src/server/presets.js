import path from 'path';
import { logger } from '@storybook/node-logger';
import serverRequire from './serverRequire';

function loadPreset(preset) {
  try {
    if (typeof preset === 'string') {
      return {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        preset: require(preset),
        options: {},
      };
    }

    const { name, options } = preset;

    return {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      preset: require(name),
      options,
    };
  } catch (e) {
    logger.warn(`  Failed to load preset: ${JSON.stringify(preset)}`);
    return false;
  }
}

function loadPresets(presets) {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  logger.info('Loading presets');

  return presets.map(loadPreset).filter(preset => preset);
}

function applyPresets(presets, config, extension) {
  if (!presets.length) {
    return config;
  }

  return presets.reduce((accumulatedConfig, { preset, options }) => {
    const extensionFn = preset[extension];

    if (extensionFn && typeof extensionFn === 'function') {
      return extensionFn.call(preset, accumulatedConfig, options);
    }

    return accumulatedConfig;
  }, config);
}

function getPresets(configDir) {
  const presets = serverRequire(path.resolve(configDir, 'presets'));
  const loadedPresets = loadPresets(presets);

  return {
    extendBabel: config => applyPresets(loadedPresets, config, 'extendBabel'),
    extendWebpack: config => applyPresets(loadedPresets, config, 'extendWebpack'),
    extendPreview: config => applyPresets(loadedPresets, config, 'extendPreview'),
    extendManager: config => applyPresets(loadedPresets, config, 'extendManager'),
  };
}

export default getPresets;
