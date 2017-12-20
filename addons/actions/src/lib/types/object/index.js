import createNamedObject from './createNamedObject';
import getObjectName from './getObjectName';

const KEY = '$___storybook.objectName';

const objectType = {
  KEY,
  // is: (value) => , // not used
  serialize: value => ({ [KEY]: getObjectName(value) }),
  deserialize: value => createNamedObject(value, KEY),
};

export default objectType;
