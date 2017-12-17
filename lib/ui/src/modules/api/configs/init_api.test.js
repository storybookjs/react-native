import initApi from './init_api';

describe('manager.api.config.initApi', () => {
  it('should expose correct API methods', done => {
    const actions = {
      api: {
        setStories: jest.fn(),
        selectStory: jest.fn(),
        selectInCurrentKind: jest.fn(),
        setQueryParams: jest.fn(),
      },
      shortcuts: {
        handleEvent: jest.fn(),
      },
    };

    const clientStore = {
      subscribe: jest.fn(),
    };

    const provider = {
      handleAPI(api) {
        expect(api.setStories).toBe(actions.api.setStories);
        expect(api.selectStory).toBe(actions.api.selectStory);
        expect(api.selectInCurrentKind).toBe(actions.api.selectInCurrentKind);
        expect(api.handleShortcut).toBe(actions.shortcuts.handleEvent);
        expect(typeof api.onStory).toBe('function');
        expect(typeof api.setQueryParams).toBe('function');
        expect(typeof api.getUrlState).toBe('function');
        done();
      },
    };

    initApi(provider, clientStore, actions);
  });

  it('should trigger the onStory callback', done => {
    const actions = { api: {}, shortcuts: {} };
    const selectedKind = 'XXdd';
    const selectedStory = 'u8sd';

    const clientStore = {
      subscribe: jest.fn(),
      getAll: () => ({
        selectedKind,
        selectedStory,
      }),
    };

    const provider = {
      handleAPI(api) {
        api.onStory((kind, story) => {
          expect(kind).toBe(selectedKind);
          expect(story).toBe(selectedStory);
          done();
        });
      },
    };

    initApi(provider, clientStore, actions);
    // calling the subscription
    clientStore.subscribe.mock.calls[0][0]();
  });

  it('should support to add multiple onStory callback', done => {
    const actions = { api: {}, shortcuts: {} };
    const selectedKind = 'XXdd';
    const selectedStory = 'u8sd';

    const clientStore = {
      subscribe: jest.fn(),
      getAll: () => ({
        selectedKind,
        selectedStory,
      }),
    };

    const provider = {
      handleAPI(api) {
        let count = 0;
        api.onStory(() => {
          count += 1;
        });

        api.onStory(() => {
          count += 1;
          expect(count).toBe(2);
          done();
        });
      },
    };

    initApi(provider, clientStore, actions);
    // calling the subscription
    clientStore.subscribe.mock.calls[0][0]();
  });

  it('should support a way to remove onStory callback', done => {
    const actions = { api: {}, shortcuts: {} };
    const selectedKind = 'XXdd';
    const selectedStory = 'u8sd';

    const clientStore = {
      subscribe: jest.fn(),
      getAll: () => ({
        selectedKind,
        selectedStory,
      }),
    };

    const provider = {
      handleAPI(api) {
        let count = 0;
        const stop = api.onStory(() => {
          count += 1;
        });
        stop();

        api.onStory(() => {
          count += 1;
          expect(count).toBe(1);
          done();
        });
      },
    };

    initApi(provider, clientStore, actions);
    // calling the subscription
    clientStore.subscribe.mock.calls[0][0]();
  });

  describe('getQueryParam', () => {
    it('should return the correct query param value', done => {
      const actions = { api: {}, shortcuts: {} };

      const clientStore = {
        subscribe: jest.fn(),
        getAll: () => ({
          customQueryParams: {
            foo: 'foo value',
            bar: 'bar value',
          },
        }),
      };

      const provider = {
        handleAPI(api) {
          const value = api.getQueryParam('foo');
          expect(value).toBe('foo value');
          done();
        },
      };

      initApi(provider, clientStore, actions);
    });
  });

  describe('getUrlState', () => {
    it('should return the correct url state value', done => {
      const actions = { api: {}, shortcuts: {} };

      const clientStore = {
        subscribe: jest.fn(),
        getAll: () => ({
          selectedKind: 'kind',
          selectedStory: 'story',
          shortcutOptions: {},
        }),
      };

      const provider = {
        handleAPI(api) {
          const value = api.getUrlState({ selectedStory: 'newStory' });
          expect(value).toMatchObject({
            selectedKind: 'kind',
            selectedStory: 'newStory',
          });
          expect(value.url).toMatch(/selectedKind=kind/);
          expect(value.url).toMatch(/selectedStory=newStory/);
          done();
        },
      };

      initApi(provider, clientStore, actions);
    });
  });
});
