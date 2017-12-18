const KEY = '$___storybook.undefined';

const undefinedType = {
  KEY,
  is: value => value === undefined,
  serialize: () => ({ [KEY]: true }),
  deserialize: () => undefined,
};

export default undefinedType;
