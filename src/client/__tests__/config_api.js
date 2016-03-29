const { describe, it } = global;
import { expect } from 'chai';
import sinon from 'sinon';
import ConfigApi from '../config_api';
import StoryStore from '../story_store';
import SyncedStore from '../synced_store';

function buildMock(fields) {
  const obj = {};
  fields.forEach(function(field) {
    function fn() {};
    obj[field] = sinon.stub();
  });

  return obj;
}

function getConfigApi() {
  const storyStore = buildMock([
    'addStory', 'removeStoryKind', 'clean',
    'hasStoryKind', 'dumpStoryBook', 'getStoryKinds',
    'hasStory', 'getStories'
  ]);
  storyStore.hasStoryKind = () => true;
  storyStore.hasStory = () => true;

  const syncedStore = buildMock([
    'setData'
  ]);
  syncedStore.getData = () => ({});

  const c = new ConfigApi({
    syncedStore,
    storyStore
  });

  return c;
}

describe('client.ConfigApi', () => {
  describe('_renderError', () => {
    it('should send error stack and message to syncedStore', () => {
      const api = getConfigApi();
      api._syncedStore.getData = () => ({});

      const message = 'the-message';
      const stack = 'the-stack';
      const error = new Error(message);
      error.stack = stack;

      api._renderError(error);

      const capturedError = api._syncedStore.setData.args[0][0].error;
      expect(capturedError).to.deep.equal({message, stack});
    });
  });

  describe('_renderMain', () => {
    it('should run loaders if provided', done => {
      const api = getConfigApi();
      const loaders = done;
      api._renderMain(loaders);
    });

    it('should set error in syncedStore to null', () => {
      const api = getConfigApi();
      api._syncedStore.getData = () => ({error: 'something-else'});
      api._renderMain();

      const data = api._syncedStore.setData.args[0][0];
      expect(data.error).to.be.equal(null);
    });

    it('should get a dump of storyStore and send it to syncedStore', () => {
      const api = getConfigApi();
      const dump = {aa: 10};
      api._storyStore.dumpStoryBook = () => (dump);
      api._renderMain();

      const data = api._syncedStore.setData.args[0][0];
      expect(data.storyStore).to.deep.equal(dump);
    });

    it('should set __updatedAt field with a updated value to syncedStore', () => {
      it('should get a dump of storyStore and send it to syncedStore', () => {
        const api = getConfigApi();
        api._renderMain();

        const data = api._syncedStore.setData.args[0][0];
        expect(data.__updatedAt >= Date.now()).to.deep.equal(dump);
      });
    });

    it('should select a new kind if the current one is not available', () => {
      const api = getConfigApi();
      api._storyStore.hasStoryKind = () => false;
      api._storyStore.getStoryKinds = () => (['abc']);
      api._renderMain();

      const data = api._syncedStore.setData.args[0][0];
      expect(data.selectedKind).to.deep.equal('abc');
    });

    describe('if there is kind', () => {
      it('should select a new story if the current one is not available', () => {
        const api = getConfigApi();
        api._storyStore.hasStoryKind = () => true;
        api._storyStore.hasStory = () => false;
        api._storyStore.getStories = () => (['kkr']);
        api._renderMain();

        const data = api._syncedStore.setData.args[0][0];
        expect(data.selectedStory).to.deep.equal('kkr');
      });
    });
  });

  describe('configure', () => {
    describe('initially', () => {
      it('should call _renderMain with loaders', () => {
        const api = getConfigApi();
        api._renderMain = sinon.stub();

        const loaders = () => {};
        const m = {};
        api.configure(loaders, m);

        expect(api._renderMain.args[0][0]).to.be.equal(loaders);
      });

      describe('if caused an error', () => {
        it('should call _renderError with the error', () => {
          const api = getConfigApi();
          const error = new Error('horra');
          api._renderMain = () => {
            throw error;
          };
          api._renderError = sinon.stub();

          const loaders = () => {};
          const m = {};
          api.configure(loaders, m);

          expect(api._renderError.args[0][0]).to.be.equal(error);
        });
      });
    });

    describe('with hot reload', () => {
      it('should call _renderMain with loaders', (done) => {
        const api = getConfigApi();
        api._renderMain = sinon.stub();

        let doAccept = null;
        const m = {
          hot: {
            accept: (fn) => {
              doAccept = fn
            },
          },
        };
        api.configure(null, m);
        doAccept();

        setTimeout(() => {
          expect(api._renderMain.callCount).to.be.equal(2);
          done();
        }, 10);
      });

      describe('if caused an error', () => {
        it('should call _renderError with the error', (done) => {
          const error = new Error('error');
          const api = getConfigApi();
          api._renderMain = () => {
            throw error;
          };
          api._renderError = sinon.stub();

          let doAccept = null;
          const m = {
            hot: {
              accept: (fn) => {
                doAccept = fn
              },
            },
          };
          api.configure(null, m);
          doAccept();

          setTimeout(() => {
            expect(api._renderError.callCount).to.be.equal(2);
            done();
          }, 10);
        });
      });
    });
  });
});
