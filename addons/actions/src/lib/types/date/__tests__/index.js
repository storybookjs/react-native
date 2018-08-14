import dateType from '..';

const date = new Date(1512137134873);
const isoString = date.toISOString();

describe('Date', () => {
  it('Recognizes Date', () => {
    expect(dateType.is(date)).toBe(true);
    expect(dateType.is(1)).toBe(false);
  });

  it('Serializes Date', () => {
    expect(dateType.serialize(date)).toEqual({ [dateType.KEY]: isoString });
  });

  it('Deserializes Date', () => {
    expect(dateType.deserialize({ [dateType.KEY]: isoString })).toEqual(date);
  });
});
