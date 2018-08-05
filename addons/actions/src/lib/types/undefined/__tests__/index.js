import undefinedType from '..';

describe('undefined', () => {
  it('Recognizes undefined', () => {
    expect(undefinedType.is(undefined)).toBe(true);
    expect(undefinedType.is(1)).toBe(false);
  });

  it('Serializes undefined', () => {
    expect(undefinedType.serialize(undefined)).toEqual({ [undefinedType.KEY]: true });
  });

  it('Deserializes undefined', () => {
    expect(undefinedType.deserialize({ [undefinedType.KEY]: true })).toEqual(undefined);
  });
});
