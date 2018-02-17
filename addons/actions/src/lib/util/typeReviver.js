import { types, objectType } from '../types';

const { hasOwnProperty } = Object.prototype;

const allTypes = types.concat(objectType);

function typeFilter(value) {
  const found = allTypes.find(type => hasOwnProperty.call(value, type.KEY));

  if (found) {
    return {
      value: found.deserialize(value),
    };
  }

  return false;
}

export default typeFilter;
