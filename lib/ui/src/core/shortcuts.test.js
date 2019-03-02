import initShortcuts from './shortcuts';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
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

  it('sets defaults, augmenting anything that was persisted', () => {
    const store = createMockStore();
    store.setState({ shortcuts: { fullScreen: ['Z'] } });

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    expect(api.getShortcutKeys().fullScreen).toEqual(['Z']);
    expect(api.getShortcutKeys().togglePanel).toEqual(['A']);
  });

  it('sets defaults, ignoring anything persisted that is out of date', () => {
    const store = createMockStore();
    store.setState({ shortcuts: { randomKey: ['Z'] } });

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    expect(api.getShortcutKeys().randomKey).not.toBeDefined();
  });

  it('sets new values', async () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    await api.setShortcut('fullScreen', ['X']);
    expect(api.getShortcutKeys().fullScreen).toEqual(['X']);
  });

  it('restores all defaults', async () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    await api.setShortcut('fullScreen', ['X']);
    await api.setShortcut('togglePanel', ['B']);
    await api.restoreAllDefaultShortcuts();
    expect(api.getShortcutKeys().fullScreen).toEqual(['F']);
    expect(api.getShortcutKeys().togglePanel).toEqual(['A']);
  });

  it('restores single default', async () => {
    const store = createMockStore();

    const { api, state } = initShortcuts({ store });
    store.setState(state);

    await api.setShortcut('fullScreen', ['X']);
    await api.setShortcut('togglePanel', ['B']);
    await api.restoreDefaultShortcut('fullScreen');
    expect(api.getShortcutKeys().fullScreen).toEqual(['F']);
    expect(api.getShortcutKeys().togglePanel).toEqual(['B']);
  });
});
