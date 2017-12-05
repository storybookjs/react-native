import createFakeConstructor from '../createFakeConstructor';

describe('createFakeConstructor', () => {
  it('creates fake constructor', () => {
    expect(
      createFakeConstructor(
        {
          name_key: 'A',
        },
        'name_key'
      ).constructor.name
    ).toEqual('A');
  });
});
