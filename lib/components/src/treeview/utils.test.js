import { mockdata } from './treeview.mockdata';

import * as utils from './utils';

describe('sanity', () => {
  test('all exports should be functions', () => {
    Object.values(utils).forEach(i => {
      expect(typeof i).toBe('function');
    });
  });
});

describe('keyEventToAction', () => {
  test('all known inputs should be transformed', () => {
    const inputs = [18, 32, 38, 40, 37, 39, 100];
    const output = inputs.map(k => utils.keyEventToAction({ keyCode: k }));

    expect(output).toEqual(['ENTER', 'SPACE', 'UP', 'DOWN', 'LEFT', 'RIGHT', false]);
  });

  test('ctrlKey blocks transform', () => {
    const inputs = [18, 32, 38, 40, 37, 39, 100];
    const output = inputs.map(k => utils.keyEventToAction({ keyCode: k, ctrlKey: true }));

    expect(output).toEqual(new Array(7).fill(false));
  });

  test('altKey blocks transform', () => {
    const inputs = [18, 32, 38, 40, 37, 39, 100];
    const output = inputs.map(k => utils.keyEventToAction({ keyCode: k, altKey: true }));

    expect(output).toEqual(new Array(7).fill(false));
  });

  test('shiftKey blocks transform', () => {
    const inputs = [18, 32, 38, 40, 37, 39, 100];
    const output = inputs.map(k => utils.keyEventToAction({ keyCode: k, shiftKey: true }));

    expect(output).toEqual(new Array(7).fill(false));
  });

  test('metaKey blocks transform', () => {
    const inputs = [18, 32, 38, 40, 37, 39, 100];
    const output = inputs.map(k => utils.keyEventToAction({ keyCode: k, metaKey: true }));

    expect(output).toEqual(new Array(7).fill(false));
  });
});

describe('parseKey', () => {
  test('it handles alt key inputs', () => {
    const output = utils.parseKey({ altKey: true });
    expect(output).toBe('alt');
  });
  test('it handles ctrl key inputs', () => {
    const output = utils.parseKey({ ctrlKey: true });
    console.log(output);
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
  test('it handles shift key inputs', () => {
    const output = utils.parseKey({ shiftKey: true });
    expect(output).toBe('shift');
  });
  test('it passes regular key through', () => {
    const output = utils.parseKey({ key: 'a' });
    expect(output).toBe('a');
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
  test('enter returns ⏎​​​', () => {
    const result = utils.keyToSymbol('enter');
    expect(result).toBe('⏎');
  });
  test("' ' returns SPACE", () => {
    const result = utils.keyToSymbol(' ');
    expect(result).toEqual('SPACE');
  });
  test('ArrowUp returns ▲​​​', () => {
    const result = utils.keyToSymbol('ArrowUp');
    expect(result).toBe('▲');
  });
  test('ArrowDown returns ▼​​​', () => {
    const result = utils.keyToSymbol('ArrowDown');
    expect(result).toBe('▼');
  });
  test('ArrowLeft returns ◀︎​​​', () => {
    const result = utils.keyToSymbol('ArrowLeft');
    expect(result).toBe('◀︎');
  });

  test('ArrowRight returns ▶︎​​​', () => {
    const result = utils.keyToSymbol('ArrowRight');
    expect(result).toBe('▶︎');
  });

  test('it capitalizes a lowercase key', () => {
    const output = utils.keyToSymbol('a');
    expect(output).toBe('A');
  });
});

describe('createId', () => {
  test('creates an id', () => {
    const inputs = ['testpath', 'testprefix'];
    const output = utils.createId(...inputs);

    expect(output).toEqual('testprefix_testpath');
  });
});

describe('get', () => {
  test('retrieved by key', () => {
    const value = {};
    const inputs = ['testkey', { testkey: value, x: 'incorrect' }];
    const output = utils.get({ path: inputs[0], dataset: inputs[1] });

    expect(output).toBe(value);
  });
  test('retrieve non-existent returns undefined', () => {
    const value = {};
    const inputs = ['NONEXISTENT', { testkey: value, x: 'incorrect' }];
    const output = utils.get({ path: inputs[0], dataset: inputs[1] });

    expect(output).toBe(undefined);
  });
});

describe('getParent', () => {
  test('retrieved by path (level 0) returns undefined', () => {
    const output = utils.getParent({ path: '1', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
  });
  test('retrieved by path (level 1) returns correctly', () => {
    const output = utils.getParent({ path: '1-12', dataset: mockdata.dataset });
    expect(output).toBe(mockdata.dataset['1']);
  });
  test('retrieved by path (level 2) returns correctly', () => {
    const output = utils.getParent({ path: '1-12-121', dataset: mockdata.dataset });
    expect(output).toBe(mockdata.dataset['1-12']);
  });
  test('retrieve non-existent returns undefined', () => {
    const output = utils.getParent({ path: 'NONEXISTENT', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
  });
});

describe('getParents', () => {
  test('retrieved by path (level 0) returns correctly', () => {
    const output = utils.getParents({ path: '1', dataset: mockdata.dataset });
    expect(output).toEqual([]);
  });
  test('retrieved by path (level 1) returns correctly', () => {
    const output = utils.getParents({ path: '1-12', dataset: mockdata.dataset });
    expect(output).toEqual([mockdata.dataset['1']]);
  });
  test('retrieved by path (level 2) returns correctly', () => {
    const output = utils.getParents({ path: '1-12-121', dataset: mockdata.dataset });
    expect(output).toEqual([mockdata.dataset['1-12'], mockdata.dataset['1']]);
  });
  test('retrieve non-existent returns empty array', () => {
    const output = utils.getParents({ path: 'NONEXISTENT', dataset: mockdata.dataset });
    expect(output).toEqual([]);
  });
});

describe('getSelected', () => {
  test('returns a list of 0', () => {
    const input = {
      a: { isSelected: false },
      b: { isSelected: false },
      c: { isSelected: false },
    };
    const output = utils.getSelected({
      dataset: input,
    });
    expect(output).toEqual([]);
  });
  test('returns a list of 1', () => {
    const input = {
      a: { isSelected: true },
      b: { isSelected: false },
      c: { isSelected: false },
    };
    const output = utils.getSelected({
      dataset: input,
    });
    expect(output).toEqual([input.a]);
  });
  test('returns a list of 2', () => {
    const input = {
      a: { isSelected: true },
      b: { isSelected: true },
      c: { isSelected: false },
    };
    const output = utils.getSelected({
      dataset: input,
    });
    expect(output).toEqual([input.a, input.b]);
  });
});

describe('getPrevious', () => {
  test('to previous sibling', () => {
    const output = utils.getPrevious({ path: '1-12', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1-11']);
  });
  test('to parent', () => {
    const output = utils.getPrevious({ path: '1-11', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1']);
  });
  test('to child of parent sibling', () => {
    const output = utils.getPrevious({ path: '2', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1-12']);
  });
  test('cannot go beyond first', () => {
    const output = utils.getPrevious({ path: '1', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
  });
  test('cannot go beyond first - parent is root', () => {
    const output = utils.getPrevious({ path: '1-11', dataset: mockdata.withRoot });
    expect(output).toBe(undefined);
  });
  test('to previous parent sibling - because parent is root', () => {
    const output = utils.getPrevious({ path: '3-31', dataset: mockdata.withRoot });
    expect(output).toBe(mockdata.withRoot['1-12']);
  });
});

describe('getNext', () => {
  test('to next sibling level 1', () => {
    const output = utils.getNext({ path: '1-11', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1-12']);
  });
  test('to next sibling level 2', () => {
    const output = utils.getNext({ path: '1-12-121', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1-12-122']);
  });
  test('to next parent', () => {
    const output = utils.getNext({ path: '1-12', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['2']);
  });
  test('to first child', () => {
    const output = utils.getNext({ path: '1', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1-11']);
  });
  test('cannot go beyond last', () => {
    const output = utils.getNext({ path: '2-22', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
  });
  test('to next sibling with root as parent', () => {
    const output = utils.getNext({ path: '1-11', dataset: mockdata.withRoot });
    expect(output).toBe(mockdata.withRoot['1-12']);
  });
  test('to next parent with root as parent - skip root', () => {
    const output = utils.getNext({ path: '1-12', dataset: mockdata.withRoot });
    expect(output).toBe(mockdata.withRoot['3-31']);
  });
});

describe('toId', () => {
  test('when base is empty', () => {
    const result = utils.toId('', 'test');
    expect(result).toBe('test');
  });
  test('when base has value', () => {
    const result = utils.toId('test', 'test');
    expect(result).toBe('test-test');
  });
});
