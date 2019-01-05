import initVersions from './versions';
import fetchLatestVersion from '../libs/fetch_latest_version';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
    }),
  };
}

jest.mock('../libs/fetch_latest_version');
const standardResponse = {
  success: true,
  data: {
    latest: {
      version: '4.0.0',
    },
  },
};

jest.mock('@storybook/client-logger');

describe('versions API', () => {
  it('sets initial state with current version', async () => {
    const { state } = initVersions({});

    expect(state.currentVersion).toBe('3.0.0');
    expect(state.versions).toEqual({
      '3.0.0': expect.objectContaining({
        version: '3.0.0',
        current: true,
      }),
    });
  });

  it('sets a update notification right away in the init function', async () => {
    const store = createMockStore();
    const { init, api, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetchLatestVersion.mockResolvedValue(standardResponse);
    const addNotification = jest.fn();
    await init({ api: { addNotification, ...api } });
    expect(addNotification).toHaveBeenCalled();
  });

  it('sets versions in the init function', async () => {
    const store = createMockStore();
    const { state: initialState, init, api } = initVersions({ store });
    store.setState(initialState);

    fetchLatestVersion.mockResolvedValue(standardResponse);
    await init({ api: { addNotification: jest.fn(), ...api } });
    expect(store.setState).toHaveBeenCalledWith({
      versions: {
        '4.0.0': expect.objectContaining({ version: '4.0.0', tag: 'latest' }),
        '3.0.0': expect.objectContaining({ version: '3.0.0', current: true }),
      },
    });
  });

  it('handles failures in ther versions function', async () => {
    const store = createMockStore();
    const { init, api, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetchLatestVersion.mockResolvedValue({
      success: false,
      error: 'error',
    });
    const addNotification = jest.fn();
    await init({ api: { addNotification, ...api } });
    expect(addNotification).not.toHaveBeenCalled();

    expect(store.getState().versions).toEqual({
      '3.0.0': expect.objectContaining({
        version: '3.0.0',
        current: true,
      }),
    });
  });

  it('getCurrentVersion works', async () => {
    const store = createMockStore();
    const { api, init, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetchLatestVersion.mockResolvedValue(standardResponse);
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

    fetchLatestVersion.mockResolvedValue(standardResponse);
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

    fetchLatestVersion.mockResolvedValue(standardResponse);
    await init({ api: { ...api, addNotification: jest.fn() } });

    expect(api.versionUpdateAvailable()).toEqual(true);
  });
});
