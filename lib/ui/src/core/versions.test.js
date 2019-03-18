import { fetch } from 'global';
import initVersions from './versions';

jest.mock('../../package.json', () => ({
  version: '3.0.0',
}));

jest.mock('global', () => ({
  fetch: jest.fn(),
}));

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
    }),
  };
}

const makeResponse = (latest, next) => {
  const nextVersion = next && {
    next: {
      version: next,
    },
  };
  return {
    json: jest.fn().mockResolvedValue({
      latest: {
        version: latest,
      },
      ...nextVersion,
    }),
  };
};

const newResponse = makeResponse('4.0.0', null);
const oldResponse = makeResponse('2.0.0', null);
const prereleaseResponse = makeResponse('3.0.0', '4.0.0-alpha.0');
const patchResponse = makeResponse('3.0.1', '4.0.0-alpha.0');

jest.mock('@storybook/client-logger');

describe('versions API', () => {
  it('sets initial state with current version', async () => {
    const store = createMockStore();
    const { state } = initVersions({ store });

    expect(state.versions).toEqual({
      current: { version: '3.0.0' },
    });
  });

  it('sets initial state based on persisted versions', async () => {
    const store = createMockStore();
    store.setState({
      versions: {
        current: { info: '3-info', version: '3.0.0' },
        latest: { version: '4.0.0', info: '4-info' },
      },
    });
    const { state } = initVersions({ store });

    expect(state.versions).toEqual({
      current: { version: '3.0.0', info: '3-info' },
      latest: { version: '4.0.0', info: '4-info' },
    });
  });

  it('sets versions in the init function', async () => {
    const store = createMockStore();
    const { state: initialState, init, api } = initVersions({ store });
    store.setState(initialState);

    fetch.mockResolvedValueOnce(newResponse);
    store.setState.mockReset();
    await init({ api: { addNotification: jest.fn(), ...api } });
    expect(store.setState).toHaveBeenCalledWith(
      {
        versions: {
          latest: { version: '4.0.0' },
          current: { version: '3.0.0' },
        },
        lastVersionCheck: expect.any(Number),
      },
      { persistence: 'permanent' }
    );
  });

  it('sets a new latest version if old version was cached', async () => {
    const store = createMockStore();
    store.setState({
      versions: {
        current: { version: '3.0.0' },
        latest: { version: '3.1.0' },
      },
    });

    const { state: initialState, init, api } = initVersions({ store });
    store.setState(initialState);

    fetch.mockResolvedValueOnce(newResponse);
    store.setState.mockReset();
    await init({ api: { addNotification: jest.fn(), ...api } });
    expect(store.setState).toHaveBeenCalledWith(
      {
        versions: {
          latest: { version: '4.0.0' },
          current: { version: '3.0.0' },
        },
        lastVersionCheck: expect.any(Number),
      },
      { persistence: 'permanent' }
    );
  });

  it('does not set versions if check was recent', async () => {
    const store = createMockStore();
    store.setState({ lastVersionCheck: Date.now() });
    const { state: initialState, init, api } = initVersions({ store });
    store.setState(initialState);

    store.setState.mockReset();
    await init({ api: { addNotification: jest.fn(), ...api } });
    expect(store.setState).not.toHaveBeenCalled();
  });

  it('handles failures in the versions function', async () => {
    const store = createMockStore();
    const { init, api, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetch.mockRejectedValueOnce(new Error('fetch failed'));
    await init({ api: { addNotification: jest.fn(), ...api } });

    expect(store.getState().versions).toEqual({
      current: { version: '3.0.0' },
    });
  });

  describe('notifications', () => {
    it('sets an update notification right away in the init function', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({ store });
      store.setState(initialState);

      fetch.mockResolvedValueOnce(newResponse);
      const addNotification = jest.fn();
      await init({ api: { addNotification, ...api } });
      expect(addNotification).toHaveBeenCalled();
    });

    it('does not set an update notification if it has been dismissed', async () => {
      const store = createMockStore();
      store.setState({ dismissedVersionNotification: '4.0.0' });
      const { init, api, state: initialState } = initVersions({ store });
      store.setState(initialState);

      fetch.mockResolvedValueOnce(newResponse);
      const addNotification = jest.fn();
      await init({ api: { addNotification, ...api } });
      expect(addNotification).not.toHaveBeenCalled();
    });

    it('does not set an update notification if the latest version is a patch', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({ store });
      store.setState(initialState);

      fetch.mockResolvedValueOnce(patchResponse);
      const addNotification = jest.fn();
      await init({ api: { addNotification, ...api } });
      expect(addNotification).not.toHaveBeenCalled();
    });

    it('does not set an update notification in production mode', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({ store, mode: 'production' });
      store.setState(initialState);

      fetch.mockResolvedValueOnce(newResponse);
      const addNotification = jest.fn();
      await init({ api: { addNotification, ...api } });
      expect(addNotification).not.toHaveBeenCalled();
    });
  });

  it('persists a dismissed notification', async () => {
    const store = createMockStore();
    const { init, api, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetch.mockResolvedValueOnce(newResponse);
    let notification;
    const addNotification = jest.fn().mockImplementation(n => {
      notification = n;
    });
    await init({ api: { addNotification, ...api } });
    notification.onClear();
    expect(store.setState).toHaveBeenCalledWith(
      { dismissedVersionNotification: '4.0.0' },
      { persistence: 'permanent' }
    );
  });

  it('getCurrentVersion works', async () => {
    const store = createMockStore();
    const { api, init, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetch.mockResolvedValueOnce(newResponse);
    await init({ api: { ...api, addNotification: jest.fn() } });

    expect(api.getCurrentVersion()).toEqual({
      version: '3.0.0',
    });
  });

  it('getLatestVersion works', async () => {
    const store = createMockStore();
    const { api, init, state: initialState } = initVersions({ store });
    store.setState(initialState);

    fetch.mockResolvedValueOnce(newResponse);
    await init({ api: { ...api, addNotification: jest.fn() } });

    expect(api.getLatestVersion()).toMatchObject({
      version: '4.0.0',
    });
  });

  describe('versionUpdateAvailable', () => {
    describe('stable current version', () => {
      it('new latest version', async () => {
        const store = createMockStore();
        const { api, init, state: initialState } = initVersions({ store });
        store.setState(initialState);

        fetch.mockResolvedValueOnce(newResponse);
        await init({ api: { ...api, addNotification: jest.fn() } });

        expect(api.versionUpdateAvailable()).toEqual(true);
      });

      it('old latest version', async () => {
        const store = createMockStore();
        const { api, init, state: initialState } = initVersions({ store });
        store.setState(initialState);

        fetch.mockResolvedValueOnce(oldResponse);
        await init({ api: { ...api, addNotification: jest.fn() } });

        expect(api.versionUpdateAvailable()).toEqual(false);
      });

      it('new next version', async () => {
        const store = createMockStore();
        const { api, init, state: initialState } = initVersions({ store });
        store.setState(initialState);

        fetch.mockResolvedValueOnce(prereleaseResponse);
        await init({ api: { ...api, addNotification: jest.fn() } });

        expect(api.versionUpdateAvailable()).toEqual(false);
      });
    });

    describe('prerelease current version', () => {
      it('new latest version', async () => {
        const store = createMockStore();
        const { api, init, state: initialState } = initVersions({ store });
        initialState.versions.current.version = '3.1.0-alpha.0';
        store.setState(initialState);

        fetch.mockResolvedValueOnce(newResponse);
        await init({ api: { ...api, addNotification: jest.fn() } });

        expect(api.versionUpdateAvailable()).toEqual(true);
      });

      it('new next version', async () => {
        const store = createMockStore();
        const { api, init, state: initialState } = initVersions({ store });
        initialState.versions.current.version = '3.1.0-alpha.0';
        store.setState(initialState);

        fetch.mockResolvedValueOnce(prereleaseResponse);
        await init({ api: { ...api, addNotification: jest.fn() } });

        expect(api.versionUpdateAvailable()).toEqual(true);
      });
    });
  });
});
