export const ADDON_ID = 'storybook/viewport';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = 'viewports';

export default {
  UPDATE: `${ADDON_ID}/update`,
  CONFIGURE: `${ADDON_ID}/configure`,
  SET: `${ADDON_ID}/setStoryDefaultViewport`,
  CHANGED: `${ADDON_ID}/viewportChanged`,
};
