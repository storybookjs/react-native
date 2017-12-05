const KEY = '$___storybook.Date';

const dateType = {
  KEY,
  is: value => value instanceof Date,
  serialize: value => ({ [KEY]: value.toISOString() }),
  deserialize: value => new Date(value[KEY]),
};

export default dateType;
