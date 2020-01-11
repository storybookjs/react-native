import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

export const sanitizeName = name => {
  let key = upperFirst(camelCase(name));
  // prepend _ if name starts with a digit
  if (/^\d/.test(key)) {
    key = `_${key}`;
  }
  // prepend _ if name starts with a digit
  if (/^\d/.test(key)) {
    key = `_${key}`;
  }
  return key;
};
