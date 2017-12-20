import nanType from '../';

describe('NaN', () => {
  it('Recognizes NaN', () => {
    expect(nanType.is(NaN)).toBe(true);
    expect(nanType.is(1)).toBe(false);
  });

  it('Serializes NaN', () => {
    expect(nanType.serialize(NaN)).toEqual({ [nanType.KEY]: true });
  });

  it('Deserializes NaN', () => {
    expect(nanType.deserialize({ [nanType.KEY]: true })).toEqual(NaN);
  });
});
