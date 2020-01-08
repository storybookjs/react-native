import dedent from 'ts-dedent';
import { join } from 'path';
import { logger } from '@storybook/node-logger';
import { resolveFile } from './utils/resolve-file';

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;
const isFunction = val => typeof val === 'function';

// Copied out of parse-package-name
const RE_SCOPED = /^(@[^/]+\/[^/@]+)(?:\/([^@]+))?(?:@([\s\S]+))?/;
const RE_NORMAL = /^([^/@]+)(?:\/([^@]+))?(?:@([\s\S]+))?/;
function parsePackageName(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  const matched = input.charAt(0) === '@' ? input.match(RE_SCOPED) : input.match(RE_NORMAL);

  if (!matched) {
    throw new Error(`[parse-package-name] "${input}" is not a valid string`);
  }

  return {
    name: matched[1],
    path: matched[2] || '',
    version: matched[3] || '',
  };
}

const resolvePresetFunction = (input, presetOptions, storybookOptions) => {
  if (isFunction(input)) {
    return input({ ...storybookOptions, ...presetOptions });
  }
  if (Array.isArray(input)) {
    return input;
  }

  return [];
};

/**
 * Parse an addon into either a managerEntry or a preset. Throw on invalid input.
 *
 * Valid inputs:
 * - '@storybook/addon-actions/register'
 *   =>  { type: 'managerEntries', item }
 *
 * - '@storybook/addon-docs/preset'
 *   =>  { type: 'presets', item }
 *
 * - '@storybook/addon-docs'
 *   =>  { type: 'presets', item: '@storybook/addon-docs/preset' }
 *
 * - { name: '@storybook/addon-docs(/preset)?', options: { ... } }
 *   =>  { type: 'presets', item: { name: '@storybook/addon-docs/preset', options } }
 */
export const resolveAddonName = name => {
  const { path } = parsePackageName(name);

  // when user provides full path, we don't need to do anything
  if (path) {
    return {
      name,
      // Accept `register`, `register.js`, `require.resolve('foo/register') cases
      type: path.match(/register(.js)?$/) ? 'managerEntries' : 'presets',
    };
  }

  try {
    return {
      name: resolveFile(join(name, 'preset')),
      type: 'presets',
    };
    // eslint-disable-next-line no-empty
  } catch (err) {}

  try {
    return {
      name: resolveFile(join(name, 'register')),
      type: 'managerEntries',
    };
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return { name, type: 'presets' };
};

export const splitAddons = addons => {
  return addons.reduce(
    (acc, item) => {
      try {
        if (isObject(item)) {
          const { name } = resolveAddonName(item.name);
          acc.presets.push({ ...item, name });
        } else {
          const { name, type } = resolveAddonName(item);
          acc[type].push(name);
        }
      } catch (err) {
        logger.error(
          `Addon value should end in /register OR it should be a valid preset https://storybook.js.org/docs/presets/introduction/\n${item}`
        );
      }
      return acc;
    },
    {
      managerEntries: [],
      presets: [],
    }
  );
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
      const { addons: addonsInput, presets: presetsInput, ...rest } = contents;

      const subPresets = resolvePresetFunction(presetsInput, presetOptions, storybookOptions);
      const subAddons = resolvePresetFunction(addonsInput, presetOptions, storybookOptions);

      const { managerEntries, presets } = splitAddons(subAddons);

      return [
        ...loadPresets([...subPresets, ...presets], level + 1, storybookOptions),
        { name: `${name}_additionalManagerEntries`, preset: { managerEntries } },
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
