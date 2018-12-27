import reviver from './reviver';
import muteProperty from './util/muteProperty';
import { CYCLIC_KEY } from '../constants';

// eslint-disable-next-line no-control-regex
const pathReg = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"/bfnrt]|u[0-9a-zA-Z]{4}))*")])*$/;

export default function retrocycle(json) {
  const $ = JSON.parse(json, reviver);

  if (typeof $ !== 'object' || $ === null) {
    return $;
  }

  (function rez(value) {
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
          const item = value[i];
          if (item && typeof item === 'object') {
            const path = item.$ref;
            if (typeof path === 'string' && pathReg.test(path)) {
              value[i] = eval(path); // eslint-disable-line no-eval, no-param-reassign
            } else {
              rez(item);
            }
          }
        }
      } else {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const name in value) {
          const item = value[name];

          if (typeof item === 'object' && item !== null) {
            const path = item.$ref;

            if (typeof path === 'string' && pathReg.test(path)) {
              value[name] = eval(path); // eslint-disable-line no-eval, no-param-reassign
            } else {
              rez(item);
            }
          }
        }
      }
    }
  })($);

  muteProperty(CYCLIC_KEY, $);

  return $;
}
