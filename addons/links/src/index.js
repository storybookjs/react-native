import { stripIndents } from 'common-tags';
import { linkTo, hrefTo, withLinks } from './preview';

let hasWarned = false;

export function LinkTo() {
  if (!hasWarned) {
    // eslint-disable-next-line no-console
    console.error(stripIndents`
      LinkTo has moved to addon-links/react:
      import LinkTo from '@storybook/addon-links/react';
    `);
    hasWarned = true;
  }
  return null;
}

export { linkTo, hrefTo, withLinks };

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
