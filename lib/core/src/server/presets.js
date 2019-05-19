import { logger } from '@storybook/node-logger';

let recursiveLoadPresets = () => {};

function interopRequireDefault(filePath) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const result = require(`${filePath}`);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

function loadPreset(preset, level) {
  try {
    if (typeof preset === 'string') {
      const resolvedPreset = interopRequireDefault(preset);

      if (Array.isArray(resolvedPreset)) {
        return recursiveLoadPresets(resolvedPreset, level + 1);
      }

      return [
        {
          preset: resolvedPreset,
          options: {},
        },
      ];
    }

    const { name, options } = preset;

    return [
      {
        preset: interopRequireDefault(name),
        options,
      },
    ];
  } catch (e) {
    const warning =
      level > 0
        ? `  Failed to load preset: ${JSON.stringify(preset)} on level ${level}`
        : `  Failed to load preset: ${JSON.stringify(preset)}`;

    logger.warn(warning);
    logger.error(e);

    return [];
  }
}

function loadPresets(presets, level = 0) {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  if (level > 0) {
    logger.info('=> Loading presets');
  }

  return presets.reduce((acc, preset) => {
    const loaded = loadPreset(preset, level);
    return acc.concat(loaded);
  }, []);
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

recursiveLoadPresets = loadPresets;

export default getPresets;
