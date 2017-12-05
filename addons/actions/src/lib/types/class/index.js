import createFakeConstructor from './createFakeConstructor';
import getClassName from './getClassName';

const KEY = '$___storybook.className';

const classType = {
  KEY,
  // is: (value) => , // not used
  serialize: value => ({ [KEY]: getClassName(value) }),
  deserialize: value => createFakeConstructor(value, KEY),
};

export default classType;
