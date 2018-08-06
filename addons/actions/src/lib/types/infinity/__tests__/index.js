import infinityType from '..';

describe('Infinity', () => {
  it('Recognizes Infinity', () => {
    expect(infinityType.is(Infinity)).toBe(true);
    expect(infinityType.is(1)).toBe(false);
  });

  it('Recognizes -Infinity', () => {
    expect(infinityType.is(-Infinity)).toBe(true);
    expect(infinityType.is(-1)).toBe(false);
  });

  it('Serializes Infinity', () => {
    expect(infinityType.serialize(Infinity)).toEqual({ [infinityType.KEY]: true });
  });

  it('Serializes -Infinity', () => {
    expect(infinityType.serialize(-Infinity)).toEqual({ [infinityType.KEY]: false });
  });

  it('Deserializes Infinity', () => {
    expect(infinityType.deserialize({ [infinityType.KEY]: true })).toEqual(Infinity);
  });

  it('Deserializes -Infinity', () => {
    expect(infinityType.deserialize({ [infinityType.KEY]: false })).toEqual(-Infinity);
  });
});
