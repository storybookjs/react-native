import createBoundFunction from './createBoundFunction';
import createFunction from './createFunction';
import isReserved from './isReserved';

const KEY = '$___storybook.functionName';

const functionType = {
  KEY,
  is: value => typeof value === 'function',
  serialize: value =>
    isReserved(value.name) ? { [KEY]: `$${value.name}` } : { [KEY]: value.name || '' },
  deserialize: value => {
    const parts = value[KEY].split(' ');

    return parts.length === 2 && parts[0] === 'bound'
      ? createBoundFunction(parts[1])
      : createFunction(parts[0]);
  },
};

export default functionType;
