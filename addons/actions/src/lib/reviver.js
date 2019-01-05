import isObject from './util/isObject';
import typeReviver from './util/typeReviver';

function reviver(key, value) {
  if (isObject(value)) {
    const result = typeReviver(value);

    if (result) {
      return result.value;
    }
  }

  return value;
}

export default reviver;
