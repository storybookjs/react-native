import { mockDataset, mockExpanded, mockSelected } from './treeview.mockdata';

import * as utils from './utils';

const noRoot = {
  dataset: mockDataset.noRoot,
  selected: mockSelected.noRoot,
  expanded: mockExpanded.noRoot,
};

const withRoot = {
  dataset: mockDataset.withRoot,
  selected: mockSelected.withRoot,
  expanded: mockExpanded.withRoot,
};

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
    const output = utils.getParent({
      path: '1',
      ...noRoot,
    });
    expect(output).toBe(undefined);
  });
  test('retrieved by path (level 1) returns correctly', () => {
    const output = utils.getParent({
      path: '1-12',
      ...noRoot,
    });
    expect(output).toBe(noRoot.dataset['1']);
  });
  test('retrieved by path (level 2) returns correctly', () => {
    const output = utils.getParent({
      path: '1-12-121',
      ...noRoot,
    });
    expect(output).toBe(noRoot.dataset['1-12']);
  });
  test('retrieve non-existent returns undefined', () => {
    const output = utils.getParent({
      path: 'NONEXISTENT',
      ...noRoot,
    });
    expect(output).toBe(undefined);
  });
});

describe('getParents', () => {
  test('retrieved by path (level 0) returns correctly', () => {
    const output = utils.getParents({
      path: '1',
      ...noRoot,
    });
    expect(output).toEqual([]);
  });
  test('retrieved by path (level 1) returns correctly', () => {
    const output = utils.getParents({
      path: '1-12',
      ...noRoot,
    });
    expect(output).toEqual([noRoot.dataset['1']]);
  });
  test('retrieved by path (level 2) returns correctly', () => {
    const output = utils.getParents({
      path: '1-12-121',
      ...noRoot,
    });
    expect(output).toEqual([noRoot.dataset['1-12'], noRoot.dataset['1']]);
  });
  test('retrieve non-existent returns empty array', () => {
    const output = utils.getParents({
      path: 'NONEXISTENT',
      ...noRoot,
    });
    expect(output).toEqual([]);
  });
});

describe('getPrevious', () => {
  test('to previous sibling', () => {
    const output = utils.getPrevious({
      path: '1-12',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['1-11']);
  });
  test('to parent', () => {
    const output = utils.getPrevious({
      path: '1-11',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['1']);
  });
  test('to child of parent sibling', () => {
    const output = utils.getPrevious({
      path: '2',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['1-12']);
  });
  test('cannot go beyond first', () => {
    const output = utils.getPrevious({
      path: '1',
      ...noRoot,
    });
    expect(output).toBe(undefined);
  });
  test('cannot go beyond first - parent is root', () => {
    const output = utils.getPrevious({
      path: '1-11',
      ...withRoot,
    });
    expect(output).toBe(undefined);
  });
  test('to previous parent sibling - because parent is root', () => {
    const output = utils.getPrevious({
      path: '3-31',
      ...withRoot,
    });
    expect(output).toBe(withRoot.dataset['1-12']);
  });
});

describe('getNext', () => {
  test('to next sibling level 1', () => {
    const output = utils.getNext({
      path: '1-11',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['1-12']);
  });
  test('to next sibling level 2', () => {
    const output = utils.getNext({
      path: '1-12-121',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['1-12-122']);
  });
  test('to next parent', () => {
    const output = utils.getNext({
      path: '1-12',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['2']);
  });
  test('to first child', () => {
    const output = utils.getNext({
      path: '1',
      ...noRoot,
    });
    expect(output).toEqual(noRoot.dataset['1-11']);
  });
  test('cannot go beyond last', () => {
    const output = utils.getNext({
      path: '2-22',
      ...noRoot,
    });
    expect(output).toBe(undefined);
  });
  test('to next sibling with root as parent', () => {
    const output = utils.getNext({ path: '1-11', ...withRoot });
    expect(output).toBe(withRoot.dataset['1-12']);
  });
  test('to next parent with root as parent - skip root', () => {
    const output = utils.getNext({ path: '1-12', ...withRoot });
    expect(output).toBe(withRoot.dataset['3-31']);
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
