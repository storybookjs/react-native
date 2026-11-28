import { PARAM_KEY } from './constants';

export interface BackgroundOption {
  name: string;
  value: string;
}

export type BackgroundOptions = Record<string, BackgroundOption>;

/**
 * `parameters.backgrounds` in either shape:
 * - current: `{ options: { key: { name, value } } }` with `initialGlobals.backgrounds.value`
 * - legacy (`@storybook/addon-ondevice-backgrounds`, Storybook 7): `{ default?: name, values: [{ name, value }] }`
 */
export interface BackgroundsParameters {
  disable?: boolean;
  options?: BackgroundOptions;
  /** @deprecated Use `options` instead. */
  values?: BackgroundOption[];
  /** @deprecated Use `initialGlobals.backgrounds.value` instead. */
  default?: string;
}

export interface NormalizedBackgrounds {
  options: BackgroundOptions;
  /** Key in `options` to apply when no `backgrounds` global selects one. Only set for the legacy shape. */
  defaultKey?: string;
  disabled: boolean;
}

/**
 * Converts `parameters.backgrounds` to the options shape. Legacy `values` entries are keyed by their
 * `name`, like Storybook 8 did when it moved from `values` to `options`, so selecting one sets
 * `globals.backgrounds.value` to its name. When both shapes are present, `options` wins.
 */
export function normalizeBackgrounds(params: unknown): NormalizedBackgrounds {
  const bgParams = (params ?? {}) as BackgroundsParameters;
  const disabled = !!bgParams.disable;

  if (bgParams.options && typeof bgParams.options === 'object') {
    return { options: bgParams.options, disabled };
  }

  if (Array.isArray(bgParams.values)) {
    const options: BackgroundOptions = {};
    for (const entry of bgParams.values) {
      if (entry && typeof entry.value === 'string') {
        const name = entry.name ?? entry.value;
        options[name] = { name, value: entry.value };
      }
    }

    // The standalone addon applied `default`, or the first value when there was no default.
    const keys = Object.keys(options);
    const defaultKey = bgParams.default && options[bgParams.default] ? bgParams.default : keys[0];

    return { options, defaultKey, disabled };
  }

  return { options: {}, disabled };
}

interface StoryLike {
  globals?: Record<string, any>;
  parameters?: Record<string, any>;
}

/**
 * Background color for the story view, or `undefined` to leave it unchanged. Stories without
 * backgrounds parameters or a `backgrounds` global get no background.
 */
export function resolveStoryBackgroundColor(story?: StoryLike | null): string | undefined {
  const { options, defaultKey, disabled } = normalizeBackgrounds(story?.parameters?.[PARAM_KEY]);

  if (disabled) return undefined;

  const selected: unknown = story?.globals?.[PARAM_KEY]?.value;

  if (typeof selected === 'string' && selected) {
    if (options[selected]?.value) return options[selected].value;

    // Direct color value (e.g. hex)
    if (selected.startsWith('#')) return selected;
  }

  if (defaultKey && options[defaultKey]?.value) return options[defaultKey].value;

  return undefined;
}
