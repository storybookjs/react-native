import createNamedObject from './createNamedObject';
import getObjectName from './getObjectName';
import configureDepth from './configureDepth';

const KEY = '$___storybook.objectName';

const objectType = {
  KEY,
  // is: (value) => , // not used
  serialize: value => configureDepth({ [KEY]: getObjectName(value) }, value),
  deserialize: value => createNamedObject(value, KEY),
};

export default objectType;
