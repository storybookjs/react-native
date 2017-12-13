import { DecycleError } from './errors';

import { getPropertiesList, typeReplacer } from './util';

import { CYCLIC_KEY } from './';

import { objectType } from './types';

export default function decycle(object, depth = 10) {
  const objects = new WeakMap();

  let isCyclic = false;

  const res = (function derez(value, path, _depth) {
    let oldPath;
    let obj;

    if (Object(value) === value && _depth > depth) {
      const name = value.constructor ? value.constructor.name : typeof value;

      return `[${name}...]`;
    }

    const result = typeReplacer(value);

    if (result) {
      return result.value;
    }

    const type = typeof value;

    if (value instanceof Boolean || value instanceof Number || value instanceof String) {
      return value;
    }

    if (type === 'object' && value !== null) {
      oldPath = objects.get(value);
      if (oldPath !== undefined) {
        isCyclic = true;

        return { $ref: oldPath };
      }

      try {
        objects.set(value, path);
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
        return new DecycleError(error.message);
      }

      if (Array.isArray(value)) {
        obj = [];
        for (let i = 0; i < value.length; i += 1) {
          obj[i] = derez(value[i], `${path}[${i}]`, _depth + 1);
        }
      } else {
        obj = objectType.serialize(value);

        getPropertiesList(value).forEach(name => {
          try {
            obj[name] = derez(value[name], `${path}[${JSON.stringify(name)}]`, _depth + 1);
          } catch (error) {
            console.error(error); // eslint-disable-line no-console
            obj[name] = new DecycleError(error.message);
          }
        });
      }

      if (_depth === 0 && value instanceof Object && isCyclic) {
        obj[CYCLIC_KEY] = true;
      }

      return obj;
    }

    return value;
  })(object, '$', 0);

  return res;
}
