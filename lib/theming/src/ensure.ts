import { logger } from '@storybook/client-logger';

import { deletedDiff } from 'deep-object-diff';
import { stripIndent } from 'common-tags';

import light from './themes/light';
import { Theme, ThemeVars } from './base';
import { convert } from './create';

export const ensure = (input: ThemeVars): Theme => {
  if (!input) {
    return convert(light);
  } else {
    const missing = deletedDiff(light, input);
    if (Object.keys(missing).length) {
      logger.warn(
        stripIndent`
          Your theme is missing properties, you should update your theme!

          theme-data missing:
        `,
        missing
      );
    }

    return convert(input);
  }
};
