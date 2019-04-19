// configs
export const ID = 'addon-contexts';
export const PARAM = 'contexts';

// tokens
/**
 * OPT_OUT is a token for skipping a context, dundering the string to avoid name collisions;
 * ES6 Symbol is not available due to stringify used in Storybook event system via the channel.
 */
export const OPT_OUT = '__OPT_OUT__';

// events
export const REBOOT_MANAGER = `${ID}/REBOOT_MANAGER`;
export const UPDATE_MANAGER = `${ID}/UPDATE_MANAGER`;
export const UPDATE_PREVIEW = `${ID}/UPDATE_PREVIEW`;
