import * as utils from './utils';

describe('isSetEqual', () => {
  it('returns true if the sets contain the same elements', () => {
    const a = new Set([1, 2, 3]);
    const b = new Set([1, 3, 2]);
    expect(utils.isSetEqual(a, b)).toBe(true);
  });
  it('returns false if the sets do not contain the same elements', () => {
    const a = new Set([1, 6, 3]);
    const b = new Set([1, 3, 2]);
    expect(utils.isSetEqual(a, b)).toBe(false);
  });
});

describe('parseKey', () => {
  test('it handles alt key inputs', () => {
    const output = utils.parseKey({ altKey: true });
    expect(output).toBe('alt');
  });
  test('it handles ctrl key inputs', () => {
    const output = utils.parseKey({ ctrlKey: true });
    expect(output).toBe('control');
  });
  test('it handles meta key inputs', () => {
    const output = utils.parseKey({ metaKey: true });
    expect(output).toBe('meta');
  });
  test('it handles enter key inputs', () => {
    const output = utils.parseKey({ key: 'Enter' });
    expect(output).toBe('enter');
  });
  test('it handles space bar inputs', () => {
    const output = utils.parseKey({ key: ' ' });
    expect(output).toBe('space');
  });
  test('it handles escape inputs', () => {
    const output = utils.parseKey({ key: 'Escape' });
    expect(output).toBe('escape');
  });
  test('it handles shift key inputs', () => {
    const output = utils.parseKey({ shiftKey: true });
    expect(output).toBe('shift');
  });
  test('it capitalizes a letter key through', () => {
    const output = utils.parseKey({ key: 'a' });
    expect(output).toBe('A');
  });
  test('it passes regular key through', () => {
    const output = utils.parseKey({ key: 1 });
    expect(output).toBe(1);
  });
});

describe('keyToSymbol', () => {
  test('control returns a caret', () => {
    const result = utils.keyToSymbol('key')('control');
    expect(result).toBe('⌃');
  });

  test('meta returns ⌘', () => {
    const result = utils.keyToSymbol('key')('meta');
    expect(result).toEqual('⌘');
  });
  test('shift returns ⇧', () => {
    const result = utils.keyToSymbol('key')('shift');
    expect(result).toBe('⇧​');
  });
  test('enter returns ⏎​​​', () => {
    const result = utils.keyToSymbol('key')('enter');
    expect(result).toBe('⏎');
  });
  test("' ' returns SPACE", () => {
    const result = utils.keyToSymbol('key')(' ');
    expect(result).toEqual('SPACE');
  });
  test('escape returns esc', () => {
    const result = utils.keyToSymbol('key')('escape');
    expect(result).toEqual('esc');
  });
  test('ArrowUp returns ↑​​​', () => {
    const result = utils.keyToSymbol('nav')('ArrowUp');
    expect(result).toBe('↑');
  });
  test('ArrowDown returns ↓​​​', () => {
    const result = utils.keyToSymbol('nav')('ArrowDown');
    expect(result).toBe('↓');
  });
  test('ArrowLeft returns ←', () => {
    const result = utils.keyToSymbol('nav')('ArrowLeft');
    expect(result).toBe('←');
  });

  test('ArrowRight returns →', () => {
    const result = utils.keyToSymbol('nav')('ArrowRight');
    expect(result).toBe('→');
  });

  test('it capitalizes a lowercase key', () => {
    const output = utils.keyToSymbol('key')('a');
    expect(output).toBe('A');
  });

  describe('renderArrows', () => {
    test('ArrowUp and location "key" returns ▲​​​', () => {
      const result = utils.renderArrows('key', 'ArrowUp');
      expect(result).toBe('▲');
    });
    test('ArrowDown and location "key" returns ▼​​​', () => {
      const result = utils.renderArrows('key', 'ArrowDown');
      expect(result).toBe('▼');
    });
    test('ArrowLeft and location "key" returns ◀︎​​​', () => {
      const result = utils.renderArrows('key', 'ArrowLeft');
      expect(result).toBe('◀︎');
    });

    test('ArrowRight and location "key" returns ▶︎​​​', () => {
      const result = utils.renderArrows('key', 'ArrowRight');
      expect(result).toBe('▶︎');
    });

    test('Returns an empty string when the key does not map to anything', () => {
      const result = utils.renderArrows('key', 'bloop');
      expect(result).toBe('');
    });
  });
});
