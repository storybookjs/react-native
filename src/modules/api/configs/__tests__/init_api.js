import initApi from '../init_api';
import { expect } from 'chai';
const { describe, it } = global;
import sinon from 'sinon';

describe('manager.api.config.initApi', () => {
  it('should expose correct API methods', (done) => {
    const actions = {
      api: {
        setStories: sinon.stub(),
        selectStory: sinon.stub(),
        setQueryParams: sinon.stub(),
      },
      shortcuts: {
        handleEvent: sinon.stub(),
      },
    };

    const reduxStore = {
      subscribe: sinon.stub(),
    };

    const provider = {
      handleAPI(api) {
        expect(api.setStories).to.be.equal(actions.api.setStories);
        expect(api.selectStory).to.be.equal(actions.api.selectStory);
        expect(api.handleShortcut).to.be.equal(actions.shortcuts.handleEvent);
        expect(typeof api.onStory).to.be.equal('function');
        expect(typeof api.setQueryParams).to.be.equal('function');
        done();
      },
    };

    initApi(provider, reduxStore, actions);
  });

  it('should trigger the onStory callback', (done) => {
    const actions = { api: {}, shortcuts: {} };
    const selectedKind = 'XXdd';
    const selectedStory = 'u8sd';

    const reduxStore = {
      subscribe: sinon.stub(),
      getState: () => ({
        api: { selectedKind, selectedStory },
      }),
    };

    const provider = {
      handleAPI(api) {
        api.onStory((kind, story) => {
          expect(kind).to.be.equal(selectedKind);
          expect(story).to.be.equal(selectedStory);
          done();
        });
      },
    };

    initApi(provider, reduxStore, actions);
    // calling the subscription
    reduxStore.subscribe.args[0][0]();
  });

  it('should support to add multiple onStory callback', (done) => {
    const actions = { api: {}, shortcuts: {} };

    const reduxStore = {
      subscribe: sinon.stub(),
      getState: () => ({ api: {} }),
    };

    const provider = {
      handleAPI(api) {
        let cnt = 0;
        api.onStory(() => {
          cnt++;
        });

        api.onStory(() => {
          cnt++;
          expect(cnt).to.be.equal(2);
          done();
        });
      },
    };

    initApi(provider, reduxStore, actions);
    // calling the subscription
    reduxStore.subscribe.args[0][0]();
  });

  it('should support a way to remove onStory callback', (done) => {
    const actions = { api: {}, shortcuts: {} };

    const reduxStore = {
      subscribe: sinon.stub(),
      getState: () => ({ api: {} }),
    };

    const provider = {
      handleAPI(api) {
        let cnt = 0;
        const stop = api.onStory(() => {
          cnt++;
        });
        stop();

        api.onStory(() => {
          cnt++;
          expect(cnt).to.be.equal(1);
          done();
        });
      },
    };

    initApi(provider, reduxStore, actions);
    // calling the subscription
    reduxStore.subscribe.args[0][0]();
  });

  describe('getQueryParam', () => {
    it('should return the correct query param value', (done) => {
      const actions = { api: {}, shortcuts: {} };

      const reduxStore = {
        subscribe: sinon.stub(),
        getState: () => ({
          api: {
            customQueryParams: {
              foo: 'foo value',
              bar: 'bar value',
            },
          },
        }),
      };

      const provider = {
        handleAPI(api) {
          const value = api.getQueryParam('foo');
          expect(value).to.be.equal('foo value');
          done();
        },
      };

      initApi(provider, reduxStore, actions);
    });
  });
});
