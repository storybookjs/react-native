import { types } from '../types';

function typeReplacer(value) {
  const found = types.find(type => type.is(value));

  if (found) {
    return {
      value: found.serialize(value),
    };
  }

  return false;
}

export default typeReplacer;
