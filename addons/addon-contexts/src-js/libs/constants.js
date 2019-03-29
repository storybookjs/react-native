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
export const INIT_WRAPPER = `${ID}/INIT_WRAPPER`;
export const UPDATE_MANAGER = `${ID}/UPDATE_MANAGER`;
export const UPDATE_WRAPPER = `${ID}/UPDATE_WRAPPER`;

// actions
export const UPDATE_PROPS_MAP = `UPDATE_PROPS_MAP`;
