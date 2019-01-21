import initShortcuts from './shortcuts';
import merge from '../libs/merge';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = merge(state, s);
    }),
  };
}

describe('shortcuts api', () => {
  it('sets defaults', () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    expect(api.getShortcutKeys().fullScreen).toEqual(['F']);
  });

  it('sets new values', () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    api.setShortcut('fullScreen', ['X']);
    expect(api.getShortcutKeys().fullScreen).toEqual(['X']);
  });

  it('restores all defaults', () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    api.setShortcut('fullScreen', ['X']);
    api.setShortcut('togglePanel', ['B']);
    api.restoreAllDefaultShortcuts();
    expect(api.getShortcutKeys().fullScreen).toEqual(['F']);
    expect(api.getShortcutKeys().togglePanel).toEqual(['S']);
  });

  it('restores single default', () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    api.setShortcut('fullScreen', ['X']);
    api.setShortcut('togglePanel', ['B']);
    api.restoreDefaultShortcut('fullScreen');
    expect(api.getShortcutKeys().fullScreen).toEqual(['F']);
    expect(api.getShortcutKeys().togglePanel).toEqual(['B']);
  });
});
