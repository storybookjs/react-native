const { describe, it } = global;
import { expect } from 'chai';
import ClientApi from '../client_api';
import sinon from 'sinon';

function getClientApi() {
  const syncedStore = { aa: 30 };
  const storyStore = { aa: 10 };
  const api = new ClientApi({ syncedStore, storyStore });

  return api;
}

describe('client.ClientApi', () => {
  describe('constructor', () => {
    it('should set _syncedStore & _storyStore properly', () => {
      const syncedStore = { aa: 30 };
      const storyStore = { aa: 10 };
      const api = new ClientApi({ syncedStore, storyStore });

      expect(api._syncedStore).to.be.equal(syncedStore);
      expect(api._storyStore).to.be.equal(storyStore);
    });
  });

  describe('storiesOf', () => {
    it('should return an api where we can add stories', () => {
      const api = getClientApi();
      const chainApi = api.storiesOf('kind');
      expect(typeof chainApi.add).to.be.equal('function');
    });

    it('should remove story of the given kind, when hot module is disposing', () => {
      let doDispose = null;
      const hotModule = {
        hot: {
          dispose: (fn) => { doDispose = fn; },
        },
      };

      const api = getClientApi();
      api._storyStore.removeStoryKind = sinon.stub();
      api.storiesOf('kind', hotModule);

      doDispose();

      expect(api._storyStore.removeStoryKind.args[0][0]).to.be.equal('kind');
    });
  });

  describe('storiesOf.add', () => {
    it('should add a given story', () => {
      const api = getClientApi();
      const handle = () => {};

      api._storyStore.addStory = sinon.stub();
      api.storiesOf('kind')
        .add('name', handle);

      const args = api._storyStore.addStory.args[0];
      expect(args[0]).to.be.equal('kind');
      expect(args[1]).to.be.equal('name');
      expect(args[2]).to.be.equal(handle);
    });

    it('should support method chaining', () => {
      const api = getClientApi();
      const handle = () => {};

      api._storyStore.addStory = sinon.stub();
      api.storiesOf('kind')
        .add('name', handle)
        .add('name2', handle);
    });
  });

  describe('action', () => {
    it('should send action info to the syncedStore', () => {
      const api = getClientApi();
      api._syncedStore.getData = () => ({ actions: [] });
      api._syncedStore.setData = sinon.stub();

      const cb = api.action('hello');
      cb(10, 20);

      const args = api._syncedStore.setData.args[0];
      expect(args[0].actions).to.be.deep.equal([
        {
          name: 'hello',
          args: [10, 20],
        },
      ]);
    });

    it('should only keep the latest 5 actions in the syncedStore', () => {
      const api = getClientApi();
      api._syncedStore.getData = () => ({
        actions: [50, 40, 30, 20, 10],
      });
      api._syncedStore.setData = sinon.stub();

      const cb = api.action('hello');
      cb(10, 20);

      const args = api._syncedStore.setData.args[0];
      expect(args[0].actions).to.be.deep.equal([
        {
          name: 'hello',
          args: [10, 20],
        },
        50,
        40,
        30,
        20,
      ]);
    });

    it('should replace any Synthetic Event with it\'s name', () => {
      const api = getClientApi();
      api._syncedStore.getData = () => ({ actions: [] });
      api._syncedStore.setData = sinon.stub();

      const event = {
        preventDefault() {},
      };

      const cb = api.action('hello');
      cb(event);

      const args = api._syncedStore.setData.args[0];
      expect(args[0].actions).to.be.deep.equal([
        {
          name: 'hello',
          args: ['[SyntheticEvent]'],
        },
      ]);
    });
  });

  describe('linkTo', () => {
    it('should send kind to the syncedStore', () => {
      const api = getClientApi();
      api._syncedStore.getData = () => ({
        storyStore: [{ kind: 'Another Kind', stories: [] }],
        selectedKind: 'Some Kind',
      });
      api._syncedStore.setData = sinon.stub();

      const cb = api.linkTo('Another Kind');
      cb();

      const args = api._syncedStore.setData.args[0];
      expect(args[0].selectedKind).to.equal('Another Kind');
    });

    it('should send story to the syncedStore', () => {
      const api = getClientApi();
      api._syncedStore.getData = () => ({
        storyStore: [{ kind: 'Another Kind', stories: [] }],
        selectedKind: 'Some Kind',
        selectedStory: 'Some Story',
      });
      api._syncedStore.setData = sinon.stub();

      const cb = api.linkTo('Another Kind', 'Another Story');
      cb();

      const args = api._syncedStore.setData.args[0];
      expect(args[0].selectedKind).to.equal('Another Kind');
      expect(args[0].selectedStory).to.equal('Another Story');
    });

    it('should allow functions for story and kind', () => {
      const api = getClientApi();
      api._syncedStore.getData = () => ({
        storyStore: [{ kind: 'Another Kind', stories: [] }],
        selectedKind: 'Some Kind',
        selectedStory: 'Some Story',
      });
      api._syncedStore.setData = sinon.stub();

      const cb = api.linkTo(
        () => 'Another Kind',
        () => 'Another Story');
      cb();

      const args = api._syncedStore.setData.args[0];
      expect(args[0].selectedKind).to.equal('Another Kind');
      expect(args[0].selectedStory).to.equal('Another Story');
    });
  });
});
