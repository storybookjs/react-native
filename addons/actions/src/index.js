// addons, panels and events get unique names using a prefix
export const ADDON_ID = 'storybook/actions';
export const PANEL_ID = `${ADDON_ID}/actions-panel`;
export const EVENT_ID = `${ADDON_ID}/action-event`;

export { register } from './manager';
export { action, decorateAction } from './preview';
