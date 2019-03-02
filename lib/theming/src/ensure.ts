import { logger } from '@storybook/client-logger';

import { deletedDiff } from 'deep-object-diff';
import { stripIndent } from 'common-tags';

import mergeWith from 'lodash.mergewith';
import isEqual from 'lodash.isequal';

import light from './themes/light';
import { Theme } from './base';

const base = {
  ...light,
  animation: {},
  brand: {},
};

// merge with concatenating arrays, but no duplicates
const merge = (a: any, b: any) =>
  mergeWith({}, a, b, (objValue: any, srcValue: any) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      return objValue;
    }
    return undefined;
  });

export const ensure = (input: any): Theme => {
  if (!input) {
    return light;
  } else {
    const missing = deletedDiff(base, input);
    if (Object.keys(missing).length) {
      logger.warn(
        stripIndent`
          Your theme is missing properties, you should update your theme!

          theme-data missing:
        `,
        missing
      );
    }

    return merge(light, input);
  }
};
