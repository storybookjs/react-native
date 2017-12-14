import createRegExp from './createRegExp';

const KEY = '$___storybook.regExpKey';

const regExpType = {
  KEY,
  is: value => value instanceof RegExp,
  serialize: value => ({ [KEY]: value.toString() }),
  deserialize: value => createRegExp(value[KEY]),
};

export default regExpType;
