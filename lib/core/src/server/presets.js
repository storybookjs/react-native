import { logger } from '@storybook/node-logger';

function interopRequireDefault(filePath) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const result = require(`${filePath}`);

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
    logger.error(e);
    return false;
  }
}

function loadPresets(presets) {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  logger.info('=> Loading presets');

  const result = presets.map(loadPreset).filter(preset => preset);

  return result;
}

function applyPresets(presets, extension, config, args) {
  const presetResult = new Promise(resolve => resolve(config));

  if (!presets.length) {
    return presetResult;
  }

  return presets.reduce((accumulationPromise, { preset, options }) => {
    const extensionFn = preset[extension];

    if (extensionFn && typeof extensionFn === 'function') {
      const context = {
        extensionFn,
        preset,
        combinedOptions: { ...args, ...options },
      };

      return accumulationPromise.then(newConfig =>
        context.extensionFn.call(context.preset, newConfig, context.combinedOptions)
      );
    }

    return accumulationPromise;
  }, presetResult);
}

function getPresets(presets) {
  const loadedPresets = loadPresets(presets);

  return {
    apply: async (extension, config, args = {}) =>
      applyPresets(loadedPresets, extension, config, args),
  };
}

export default getPresets;
