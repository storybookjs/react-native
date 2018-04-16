import createNamedObject from './createNamedObject';
import getObjectName from './getObjectName';
import configureDepth from './configureDepth';

const maxDepth = 2;
const KEY = '$___storybook.objectName';

const objectType = {
  KEY,
  // is: (value) => , // not used
  serialize: value => {
    const objectName = getObjectName(value);
    if (objectName === 'Object') {
      return { [KEY]: objectName };
    }

    return configureDepth({ [KEY]: objectName }, maxDepth);
  },
  deserialize: value => createNamedObject(value, KEY),
};

export default objectType;
