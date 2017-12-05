import classType from '../';

describe('Class', () => {
  it('Serializes Class', () => {
    class C {}
    const c = new C();

    expect(classType.serialize(c)).toEqual({ [classType.KEY]: 'C' });
  });

  it('Deserializes Class', () => {
    const value = { [classType.KEY]: 'C' };
    const c = classType.deserialize(value);

    expect(c.constructor.name).toEqual('C');

    expect(value).toEqual({});
  });
});
