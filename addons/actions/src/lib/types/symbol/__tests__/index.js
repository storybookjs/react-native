import symbolType from '..';

const symbol = Symbol('S');

describe('Symbol', () => {
  it('Recognizes Symbol', () => {
    expect(symbolType.is(symbol)).toBe(true);
    expect(symbolType.is(1)).toBe(false);
  });

  it('Serializes Symbol', () => {
    expect(symbolType.serialize(symbol)).toEqual({ [symbolType.KEY]: 'S' });
  });

  it('Deserializes Symbol', () => {
    expect(symbolType.deserialize({ [symbolType.KEY]: 'S' }).toString()).toEqual(symbol.toString());
  });
});
