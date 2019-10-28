import dedent from 'ts-dedent';
import { linkTo, hrefTo, withLinks } from './preview';

let hasWarned = false;

export function LinkTo(): null {
  if (!hasWarned) {
    // eslint-disable-next-line no-console
    console.error(dedent`
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
