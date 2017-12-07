import { typeReplacer } from './util';

import { CYCLIC_KEY } from './';

import { classType } from './types';

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

      objects.set(value, path);

      if (Array.isArray(value)) {
        obj = [];
        for (let i = 0; i < value.length; i += 1) {
          obj[i] = derez(value[i], `${path}[${i}]`, _depth + 1);
        }
      } else {
        obj = classType.serialize(value);

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const name in value) {
          obj[name] = derez(value[name], `${path}[${JSON.stringify(name)}]`, _depth + 1);
        }
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
