import storySort from './storySort';

describe('preview.storySort', () => {
  const fixture = {
    a: ['', { kind: 'a' }],
    á: ['', { kind: 'á' }],
    A: ['', { kind: 'A' }],
    b: ['', { kind: 'b' }],
    a_a: ['', { kind: 'a/a' }],
    a_b: ['', { kind: 'a/b' }],
    b_a_a: ['', { kind: 'b/a/a' }],
    b_b: ['', { kind: 'b/b' }],
    locale1: ['', { kind: 'Б' }],
    locale2: ['', { kind: 'Г' }],
  };

  it('uses configure order by default', () => {
    const sortFn = storySort();

    expect(sortFn(fixture.a, fixture.b)).toBe(0);
    expect(sortFn(fixture.b, fixture.a)).toBe(0);
    expect(sortFn(fixture.a, fixture.a)).toBe(0);
  });

  it('can sort shallow kinds alphabetically', () => {
    const sortFn = storySort({ method: 'alphabetical' });

    expect(sortFn(fixture.a, fixture.b)).toBeLessThan(0);
    expect(sortFn(fixture.b, fixture.a)).toBeGreaterThan(0);
    expect(sortFn(fixture.a, fixture.á)).toBeLessThan(0);
    expect(sortFn(fixture.á, fixture.a)).toBeGreaterThan(0);
  });

  it('can sort deep kinds alphabetically', () => {
    const sortFn = storySort({ method: 'alphabetical' });

    expect(sortFn(fixture.a_a, fixture.a_b)).toBeLessThan(0);
    expect(sortFn(fixture.a_b, fixture.a_a)).toBeGreaterThan(0);
    expect(sortFn(fixture.a_a, fixture.b)).toBeLessThan(0);
    expect(sortFn(fixture.b, fixture.a_a)).toBeGreaterThan(0);
    expect(sortFn(fixture.a_a, fixture.a)).toBeGreaterThan(0);
    expect(sortFn(fixture.a, fixture.a_a)).toBeLessThan(0);
    expect(sortFn(fixture.b_a_a, fixture.b_b)).toBeLessThan(0);
    expect(sortFn(fixture.b_b, fixture.b_a_a)).toBeGreaterThan(0);
  });

  it('ignores case when sorting alphabetically', () => {
    const sortFn = storySort({ method: 'alphabetical' });

    expect(sortFn(fixture.a, fixture.A)).toBe(0);
    expect(sortFn(fixture.A, fixture.a)).toBe(0);
  });

  it('sorts alphabetically using the given locales', () => {
    const sortFn = storySort({ method: 'alphabetical', locales: 'ru-RU' });

    expect(sortFn(fixture.locale1, fixture.locale2)).toBeLessThan(0);
    expect(sortFn(fixture.locale2, fixture.locale1)).toBeGreaterThan(0);
  });

  it('sorts according to the order array', () => {
    const sortFn = storySort({ order: ['b', 'c'] });

    expect(sortFn(fixture.a, fixture.b)).toBeGreaterThan(0);
    expect(sortFn(fixture.b, fixture.a)).toBeLessThan(0);
    expect(sortFn(fixture.b_a_a, fixture.b_b)).toBe(0);
    expect(sortFn(fixture.b_b, fixture.b_a_a)).toBe(0);
  });

  it('sorts according to the nested order array', () => {
    const sortFn = storySort({ order: ['a', ['b', 'c'], 'c'] });

    expect(sortFn(fixture.a_a, fixture.a_b)).toBeGreaterThan(0);
    expect(sortFn(fixture.a_b, fixture.a_a)).toBeLessThan(0);
  });
});
