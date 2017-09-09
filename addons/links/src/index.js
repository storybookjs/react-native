export const ADDON_ID = 'storybook/links';
export const EVENT_ID = `${ADDON_ID}/link-event`;
export const REQUEST_HREF_EVENT_ID = `${ADDON_ID}/request-href-event`;
export const RECEIVE_HREF_EVENT_ID = `${ADDON_ID}/receive-href-event`;

export { register } from './manager';
export { linkTo, hrefTo } from './preview';
export { default as LinkTo } from './components/link';
