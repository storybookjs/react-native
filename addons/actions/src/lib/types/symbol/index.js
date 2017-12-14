import createSymbol from './createSymbol';

const KEY = '$___storybook.symbolName';

const symbolType = {
  KEY,
  is: value => typeof value === 'symbol',
  serialize: value => ({ [KEY]: String(value).slice(7, -1) || null }),
  deserialize: value => createSymbol(value[KEY]),
};

export default symbolType;
