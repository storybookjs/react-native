import createNamedObject from '../createNamedObject';

describe('createNamedObject', () => {
  it('creates named object', () => {
    expect(
      createNamedObject(
        {
          name_key: 'A',
        },
        'name_key'
      ).constructor.name
    ).toEqual('A');
  });
});
