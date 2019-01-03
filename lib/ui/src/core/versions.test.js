import initVersions from './versions';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
    }),
  };
}

describe('versions API', () => {
  it('sets initial state with current version', async () => {
    const { state } = initVersions({});

    expect(state.currentVersion).toBe('3.0.0');
  });

  it('sets a update notification right away in the init function', async () => {
    const store = { getState: jest.fn().mockReturnValue({}), setState: jest.fn() };
    const { init } = initVersions({ store });

    const api = { addNotification: jest.fn(), addVersion: jest.fn() };
    await init({ api });
    expect(api.addNotification).toHaveBeenCalled();
  });

  it('sets versions in the init function', async () => {
    const store = createMockStore();
    const { state: initialState, init } = initVersions({ store });
    store.setState(initialState);

    const api = { addNotification: jest.fn(), addVersion: jest.fn() };
    await init({ api });
    expect(store.setState).toHaveBeenCalledWith({
      versions: {
        '4.0.0': expect.objectContaining({ version: '4.0.0', tag: 'latest' }),
        '3.0.0': expect.objectContaining({ version: '3.0.0', current: true }),
      },
    });
  });

  it('getCurrentVersion works', async () => {
    const store = createMockStore();
    const { api, init, state: initialState } = initVersions({ store });
    store.setState(initialState);
    await init({ api: { ...api, addNotification: jest.fn() } });

    expect(api.getCurrentVersion()).toEqual({
      version: '3.0.0',
      current: true,
    });
  });

  it('getLatestVersion works', async () => {
    const store = createMockStore();
    const { api, init, state: initialState } = initVersions({ store });
    store.setState(initialState);
    await init({ api: { ...api, addNotification: jest.fn() } });

    expect(api.getLatestVersion()).toMatchObject({
      version: '4.0.0',
      tag: 'latest',
    });
  });

  it('versionUpdateAvailable works', async () => {
    const store = createMockStore();
    const { api, init, state: initialState } = initVersions({ store });
    store.setState(initialState);
    await init({ api: { ...api, addNotification: jest.fn() } });

    expect(api.versionUpdateAvailable()).toEqual(true);
  });
});
