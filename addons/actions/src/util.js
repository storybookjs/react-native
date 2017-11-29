export const CLASS_NAME_KEY = '$___storybook.className';
export const CYCLIC_KEY = '$___storybook.isCyclic';

export function muteProperty(key, value) {
  return Object.defineProperty(value, key, { enumerable: false });
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function createFakeConstructor(obj) {
  function FakeConstructor(data) {
    Object.assign(this, data);
  }

  Object.defineProperty(FakeConstructor, 'name', {
    value: obj[CLASS_NAME_KEY],
  });

  delete obj[CLASS_NAME_KEY]; // eslint-disable-line no-param-reassign

  return new FakeConstructor(obj);
}

export function reviver(key, value) {
  if (isObject(value) && value[CLASS_NAME_KEY]) {
    return createFakeConstructor(value);
  }

  return value;
}

// Based on: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
export function decycle(object, depth = 15) {
  const objects = new WeakMap();
  let isCyclic = false;

  return (function derez(value, path, _depth) {
    let oldPath;
    let obj;

    if (Object(value) === value && _depth > depth) {
      return `[${value.constructor.name}...]`;
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Date) &&
      !(value instanceof Number) &&
      !(value instanceof RegExp) &&
      !(value instanceof String)
    ) {
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
        obj = { [CLASS_NAME_KEY]: value.constructor ? value.constructor.name : 'Object' };

        // We want to iterate over all the enumerable properties, including the ones in prototype chain
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const name in value) {
          // noinspection JSUnfilteredForInLoop
          obj[name] = derez(value[name], `${path}[${JSON.stringify(name)}]`, _depth + 1);
        }
      }

      if (_depth === 0 && isObject(value) && isCyclic) {
        obj[CYCLIC_KEY] = true;
      }

      return obj;
    }

    return value;
  })(object, '$', 0);
}

export function retrocycle(json) {
  const pathReg = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"/bfnrt]|u[0-9a-zA-Z]{4}))*")])*$/;

  const $ = JSON.parse(json, reviver);

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
        Object.keys(value).forEach(name => {
          const item = value[name];

          if (typeof item === 'object' && item !== null) {
            const path = item.$ref;

            if (typeof path === 'string' && pathReg.test(path)) {
              value[name] = eval(path); // eslint-disable-line no-eval, no-param-reassign
            } else {
              rez(item);
            }
          }
        });
      }
    }
  })($);

  muteProperty(CYCLIC_KEY, $);

  return $;
}
