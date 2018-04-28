import { DecycleError } from './errors';

import { getPropertiesList, typeReplacer, omitProperty } from './util';

import { CYCLIC_KEY } from './';

import { objectType } from './types';

import { DEPTH_KEY } from './types/object/configureDepth';

const { hasOwnProperty } = Object.prototype;

export default function decycle(object, depth = 10) {
  const objects = new WeakMap();

  let isCyclic = false;

  const res = (function derez(value, path, _depth, _branchDepthMax) {
    let oldPath;
    let obj;

    let maxDepth = _branchDepthMax;

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
          obj[i] = derez(value[i], `${path}[${i}]`, _depth + 1, maxDepth);
        }
      } else {
        obj = objectType.serialize(value);

        let newDepth;
        if (hasOwnProperty.call(obj, DEPTH_KEY)) {
          if (_depth + 1 < maxDepth) {
            const depthKey = obj[DEPTH_KEY];

            newDepth = depthKey === 0 ? 0 : _depth + depthKey;
            maxDepth = newDepth >= depth ? depth : newDepth;
          }

          delete obj[DEPTH_KEY];
        }

        if (_depth <= maxDepth) {
          getPropertiesList(value).forEach(name => {
            if (!omitProperty(name)) {
              try {
                obj[name] = derez(
                  value[name],
                  `${path}[${JSON.stringify(name)}]`,
                  _depth + 1,
                  maxDepth
                );
              } catch (error) {
                console.error(error); // eslint-disable-line no-console
                obj[name] = new DecycleError(error.message);
              }
            }
          });
        }
      }

      if (_depth === 0 && value instanceof Object && isCyclic) {
        obj[CYCLIC_KEY] = true;
      }

      return obj;
    }

    return value;
  })(object, '$', 0, depth);

  return res;
}
