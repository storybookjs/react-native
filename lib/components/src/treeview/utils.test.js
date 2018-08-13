import React from 'react';
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
});

describe('createId', () => {
  test('creates an id', () => {
    const inputs = ['testpath', 'testprefix'];
    const output = utils.createId(...inputs);

    expect(output).toEqual('treeview_testprefix-testpath');
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
  test('retrieved by path (root) returns undefined', () => {
    const output = utils.getParent({ path: 'root', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
  });
  test('retrieved by path (level 0) returns correctly', () => {
    const output = utils.getParent({ path: '1', dataset: mockdata.dataset });
    expect(output).toBe(mockdata.dataset.root);
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
  test('retrieved by path (root) returns undefined', () => {
    const output = utils.getParents({ path: 'root', dataset: mockdata.dataset });
    expect(output).toEqual([]);
  });
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
  test('retrieve non-existent returns undefined', () => {
    const output = utils.getParents({ path: 'NONEXISTENT', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
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
});

describe('getNext', () => {
  test('to next sibling', () => {
    const output = utils.getNext({ path: '1-11', dataset: mockdata.dataset });
    expect(output).toEqual(mockdata.dataset['1-12']);
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
    const output = utils.getNext({ path: '2.22', dataset: mockdata.dataset });
    expect(output).toBe(undefined);
  });
});

describe('isRoot', () => {
  test('when it matched', () => {
    const result = utils.isRoot('a', { id: 'a' });
    expect(result).toBe(true);
  });
  test('when it does not match', () => {
    const result = utils.isRoot('a', { id: 'b' });
    expect(result).toBe(false);
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

describe('toDataset', () => {
  test('convert correctly', () => {
    const result = utils.toDataset(mockdata.input);
    expect(result).toEqual(mockdata.dataset);
  });
});

describe('toNested', () => {
  test('convert correctly', () => {
    const result = utils.toNested(mockdata.dataset);
    expect(result).toEqual(mockdata.nested);
  });
});
