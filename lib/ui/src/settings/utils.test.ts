import * as utils from './utils';
const ev = (attr: object) => new KeyboardEvent('keydown', { ...attr });
describe('parseKey', () => {
  test('it handles alt key inputs', () => {
    const output = utils.parseKey(ev({ altKey: true }));
    expect(output).toEqual(['alt']);
  });
  test('it handles ctrl key inputs', () => {
    const output = utils.parseKey(ev({ ctrlKey: true }));
    expect(output).toEqual(['control']);
  });
  test('it handles meta key inputs', () => {
    const output = utils.parseKey(ev({ metaKey: true }));
    expect(output).toEqual(['meta']);
  });
  test('it handles enter key inputs', () => {
    const output = utils.parseKey(ev({ key: 'Enter' }));
    expect(output).toEqual([]);
  });
  test('it handles space bar inputs', () => {
    const output = utils.parseKey(ev({ key: ' ' }));
    expect(output).toEqual(['space']);
  });
  test('it handles escape inputs', () => {
    const output = utils.parseKey(ev({ key: 'Escape' }));
    expect(output).toEqual(['escape']);
  });
  test('it handles shift key inputs', () => {
    const output = utils.parseKey(ev({ shiftKey: true }));
    expect(output).toEqual(['shift']);
  });
  test('it capitalizes a letter key through', () => {
    const output = utils.parseKey(ev({ key: 'a' }));
    expect(output).toEqual(['A']);
  });
  test('it passes regular key through', () => {
    const output = utils.parseKey(ev({ key: '1' }));
    expect(output).toEqual(['1']);
  });
});

describe('keyToSymbol', () => {
  test('control returns a caret', () => {
    const result = utils.keyToSymbol('control');
    expect(result).toBe('⌃');
  });

  test('meta returns ⌘', () => {
    const result = utils.keyToSymbol('meta');
    expect(result).toEqual('⌘');
  });
  test('shift returns ⇧', () => {
    const result = utils.keyToSymbol('shift');
    expect(result).toBe('⇧​');
  });
  test('enter returns an empty string', () => {
    const result = utils.keyToSymbol('Enter');
    expect(result).toBe('');
  });

  // tslint:disable-next-line:quotemark
  test("' ' returns SPACE", () => {
    const result = utils.keyToSymbol(' ');
    expect(result).toEqual('SPACE');
  });
  test('escape returns esc', () => {
    const result = utils.keyToSymbol('escape');
    expect(result).toEqual('');
  });
  test('ArrowUp returns ↑​​​', () => {
    const result = utils.keyToSymbol('ArrowUp');
    expect(result).toBe('↑');
  });
  test('ArrowDown returns ↓​​​', () => {
    const result = utils.keyToSymbol('ArrowDown');
    expect(result).toBe('↓');
  });
  test('ArrowLeft returns ←', () => {
    const result = utils.keyToSymbol('ArrowLeft');
    expect(result).toBe('←');
  });

  test('ArrowRight returns →', () => {
    const result = utils.keyToSymbol('ArrowRight');
    expect(result).toBe('→');
  });

  test('it capitalizes a lowercase key', () => {
    const output = utils.keyToSymbol('a');
    expect(output).toBe('A');
  });
});
