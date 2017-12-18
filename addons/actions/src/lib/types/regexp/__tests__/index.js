import regExpType from '../';

const regExp = /aRegExp/g;

describe('RegExp', () => {
  it('Recognizes RegExp', () => {
    expect(regExpType.is(regExp)).toBe(true);
    expect(regExpType.is(1)).toBe(false);
  });

  it('Serializes RegExp', () => {
    expect(regExpType.serialize(regExp)).toEqual({ [regExpType.KEY]: '/aRegExp/g' });
  });

  it('Deserializes RegExp', () => {
    expect(regExpType.deserialize({ [regExpType.KEY]: '/aRegExp/g' })).toEqual(regExp);
  });
});
