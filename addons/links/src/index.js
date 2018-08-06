import { ADDON_ID, EVENT_ID, REQUEST_HREF_EVENT_ID, RECEIVE_HREF_EVENT_ID } from './events';
import { linkTo, hrefTo, withLinks } from './preview';

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

export {
  ADDON_ID,
  EVENT_ID,
  REQUEST_HREF_EVENT_ID,
  RECEIVE_HREF_EVENT_ID,
  linkTo,
  hrefTo,
  withLinks,
};
