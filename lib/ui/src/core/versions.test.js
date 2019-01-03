import initVersions from './versions';

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
    let state = {};
    const store = {
      getState: jest.fn().mockImplementation(() => state),
      setState: jest.fn().mockImplementation(s => {
        state = { ...state, ...s };
      }),
    };
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
});
