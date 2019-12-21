import { logger } from '@storybook/node-logger';
import dedent from 'ts-dedent';

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;
const isFunction = val => typeof val === 'function';

const sanitizeSubPresets = (input, presetOptions, storybookOptions) => {
  if (isFunction(input)) {
    return input({ ...storybookOptions, ...presetOptions });
  }
  if (Array.isArray(input)) {
    return input;
  }

  return [];
};

function interopRequireDefault(filePath) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const result = require(`${filePath}`);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

function loadPreset(input, level, storybookOptions) {
  try {
    const name = input.name ? input.name : input;
    const presetOptions = input.options ? input.options : {};
    const contents = interopRequireDefault(name);

    if (Array.isArray(contents)) {
      const subPresets = contents;
      return loadPresets(subPresets, level + 1, storybookOptions);
    }

    if (isObject(contents)) {
      const { presets: subPresetsInput, ...rest } = contents;
      const subPresets = sanitizeSubPresets(subPresetsInput, presetOptions, storybookOptions);

      return [
        ...loadPresets(subPresets, level + 1, storybookOptions),
        {
          name,
          preset: rest,
          options: presetOptions,
        },
      ];
    }

    throw new Error(dedent`
      ${input} is not a valid preset
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

function loadPresets(presets, level, storybookOptions) {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  if (!level) {
    logger.info('=> Loading presets');
  }

  return presets.reduce((acc, preset) => {
    const loaded = loadPreset(preset, level, storybookOptions);
    return acc.concat(loaded);
  }, []);
}

function applyPresets(presets, extension, config, args) {
  const presetResult = new Promise(resolve => resolve(config));

  if (!presets.length) {
    return presetResult;
  }

  return presets.reduce((accumulationPromise, { preset, options }) => {
    const change = preset[extension];

    if (!change) {
      return accumulationPromise;
    }

    if (typeof change === 'function') {
      const extensionFn = change;
      const context = {
        extensionFn,
        preset,
        combinedOptions: { ...args, ...options, presetsList: presets },
      };

      return accumulationPromise.then(newConfig =>
        context.extensionFn.call(context.preset, newConfig, context.combinedOptions)
      );
    }

    return accumulationPromise.then(newConfig => {
      if (Array.isArray(newConfig) && Array.isArray(change)) {
        return [...newConfig, ...change];
      }
      if (isObject(newConfig) && isObject(change)) {
        return { ...newConfig, ...change };
      }
      return change;
    });
  }, presetResult);
}

function getPresets(presets, storybookOptions) {
  const loadedPresets = loadPresets(presets, 0, storybookOptions);

  return {
    apply: async (extension, config, args = {}) =>
      applyPresets(loadedPresets, extension, config, args),
  };
}

export default getPresets;
