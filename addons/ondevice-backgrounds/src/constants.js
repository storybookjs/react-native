export const ADDON_ID = 'storybook-addon-background';
export const PANEL_ID = `${ADDON_ID}/background-panel`;

export default {
  SET: `${ADDON_ID}:set`,
  UNSET: `${ADDON_ID}:unset`,
  UPDATE_BACKGROUND: `${ADDON_ID}:update`,
  PARAM_KEY: 'backgrounds',
};
