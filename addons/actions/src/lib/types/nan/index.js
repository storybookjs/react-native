const KEY = '$___storybook.NaN';
const NaNType = {
  KEY,
  is: value => typeof value === 'number' && Number.isNaN(value),
  serialize: () => ({ [KEY]: true }),
  deserialize: () => NaN,
};

export default NaNType;
