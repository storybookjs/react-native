import objectType from '../';

describe('Object', () => {
  it('Serializes Object', () => {
    function C() {}
    const c = new C();

    expect(objectType.serialize(c)).toEqual({ [objectType.KEY]: 'C' });
  });

  it('Deserializes Object', () => {
    const value = { [objectType.KEY]: 'C' };
    const c = objectType.deserialize(value);

    expect(c.constructor.name).toEqual('C');

    expect(value).toEqual({});
  });
});
