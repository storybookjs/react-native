import mergeWith from 'lodash.mergewith';
import isEqual from 'lodash.isequal';

import { logger } from '@storybook/client-logger';

export default (a, b) =>
  mergeWith({}, a, b, (objValue, srcValue) => {
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
      logger.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });
