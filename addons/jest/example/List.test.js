describe('Description: ', () => {
  it('should contain 3 items', () => {
    expect(3).toBe(3);
  });

  it('should work fine', () => {
    expect(true).toBe(true);
  });
});

test('Failing test',() => {
  expect(['foo', 'bar', 'baz']).toEqual(['foo', 'bar']);
})
