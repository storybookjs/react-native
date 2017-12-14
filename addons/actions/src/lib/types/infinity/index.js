const KEY = '$___storybook.Infinity';

const InfinityType = {
  KEY,
  is: value => typeof value === 'number' && !Number.isFinite(value),
  serialize: value => ({ [KEY]: value === Infinity }),
  deserialize: value => (value[KEY] ? Infinity : -Infinity),
};

export default InfinityType;
