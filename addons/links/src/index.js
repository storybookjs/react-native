export const ADDON_ID = 'storybook/links';
export const EVENT_ID = `${ADDON_ID}/link-event`;
export const REQUEST_HREF_EVENT_ID = `${ADDON_ID}/request-href-event`;
export const RECEIVE_HREF_EVENT_ID = `${ADDON_ID}/receive-href-event`;

export { linkTo, hrefTo } from './preview';

let hasWarned = false;

export function LinkTo() {
  if (!hasWarned) {
    // eslint-disable-next-line no-console
    console.error(`
LinkTo has moved to addon-links/react:

import LinkTo from '@storybook/addon-links/react';
    `);
    hasWarned = true;
  }
  return null;
}
