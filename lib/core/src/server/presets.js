import { logger } from '@storybook/node-logger';

function interopRequireDefault(filePath) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const result = require(filePath);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

function loadPreset(preset) {
  try {
    if (typeof preset === 'string') {
      return {
        preset: interopRequireDefault(preset),
        options: {},
      };
    }

    const { name, options } = preset;

    return {
      preset: interopRequireDefault(name),
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

  logger.info('=> Loading presets');

  return presets.map(loadPreset).filter(preset => preset);
}

function applyPresets(presets, config, args = {}, extension) {
  if (!presets.length) {
    return config;
  }

  return presets.reduce((accumulatedConfig, { preset, options }) => {
    const extensionFn = preset[extension];

    if (extensionFn && typeof extensionFn === 'function') {
      const combinedOptions = {
        ...args,
        ...options,
      };

      return extensionFn.call(preset, accumulatedConfig, combinedOptions);
    }

    return accumulatedConfig;
  }, config);
}

function getPresets(presets) {
  const loadedPresets = loadPresets(presets);

  return {
    babel: (config, args) => applyPresets(loadedPresets, config, args, 'babel'),
    babelDefault: (config, args) => applyPresets(loadedPresets, config, args, 'babelDefault'),
    webpack: (config, args) => applyPresets(loadedPresets, config, args, 'webpack'),
    preview: (config, args) => applyPresets(loadedPresets, config, args, 'preview'),
    manager: (config, args) => applyPresets(loadedPresets, config, args, 'manager'),
  };
}

export default getPresets;
