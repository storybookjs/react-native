import { defaultTitleSlot } from './Title';

describe('defaultTitleSlot', () => {
  it('showRoots', () => {
    const parameters = {
      options: { showRoots: true },
    };
    expect(defaultTitleSlot({ selectedKind: 'a/b/c', parameters })).toBe('c');
    expect(defaultTitleSlot({ selectedKind: 'a|b', parameters })).toBe('a|b');
    expect(defaultTitleSlot({ selectedKind: 'a/b/c.d', parameters })).toBe('c.d');
  });
  it('no showRoots', () => {
    const parameters = {};
    expect(defaultTitleSlot({ selectedKind: 'a/b/c', parameters })).toBe('c');
    expect(defaultTitleSlot({ selectedKind: 'a|b', parameters })).toBe('b');
    expect(defaultTitleSlot({ selectedKind: 'a/b/c.d', parameters })).toBe('d');
  });
});
