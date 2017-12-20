test('true should be true', () => {
  expect(true).toBe(true);
});

describe('In a describe: ', () => {
  test('true should still be true', () => {
    expect(true).toBe(true);
  });

  test('a list should contain 3 items', () => {
    expect(['a', 'b', '3']).toHaveLength(3);
  });

  test('everything is awesome', () => {
    expect('everything is all right').toEqual('everything is awesome');
  });
});

describe('A bunch of failing tests: ', () => {
  test('true should still be true', () => {
    expect(true).toBe(false);
  });

  test('a list should contain 3 items', () => {
    expect(['a', 'b', '3']).toContain(301);
  });

  test('should work', () => {
    expect(() => {}).toThrow();
  });
});
