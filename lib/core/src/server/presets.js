import { logger } from '@storybook/node-logger';
import dedent from 'ts-dedent';

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;

function interopRequireDefault(filePath) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const result = require(`${filePath}`);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

function loadPreset(input, level) {
  try {
    const name = input.name ? input.name : input;
    const options = input.options ? input.options : {};
    const contents = interopRequireDefault(name);

    if (Array.isArray(contents)) {
      const subPresets = contents;
      return loadPresets(subPresets, level + 1);
    }

    if (isObject(contents)) {
      const { presets: subPresets, ...rest } = contents;

      return [
        ...(subPresets ? loadPresets(subPresets, level + 1) : []),
        {
          preset: rest,
          options,
        },
      ];
    }

    throw new Error(dedent`
      ${contents} is not a valid preset
    `);
  } catch (e) {
    const warning =
      level > 0
        ? `  Failed to load preset: ${JSON.stringify(input)} on level ${level}`
        : `  Failed to load preset: ${JSON.stringify(input)}`;

    logger.warn(warning);
    logger.error(e);

    return [];
  }
}

function loadPresets(presets, level = 0) {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  if (!level) {
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

export default getPresets;
