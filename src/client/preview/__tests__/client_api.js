import ClientAPI from '../client_api';
const { describe, it } = global;
import { expect } from 'chai';

class StoryStore {
  constructor() {
    this.stories = [];
  }

  addStory(kind, story, fn) {
    this.stories.push({ kind, story, fn });
  }
}

describe('preview.client_api', () => {
  describe('setAddon', () => {
    it('should register addons', () => {
      const api = new ClientAPI({});
      let data;

      api.setAddon({
        aa() {
          data = 'foo';
        },
      });

      api.storiesOf('none').aa();
      expect(data).to.be.equal('foo');
    });

    it('should not remove previous addons', () => {
      const api = new ClientAPI({});
      const data = [];

      api.setAddon({
        aa() {
          data.push('foo');
        },
      });

      api.setAddon({
        bb() {
          data.push('bar');
        },
      });

      api.storiesOf('none').aa().bb();
      expect(data).to.deep.equal(['foo', 'bar']);
    });

    it('should call with the api context', () => {
      const api = new ClientAPI({});
      let data;

      api.setAddon({
        aa() {
          data = typeof this.add;
        },
      });

      api.storiesOf('none').aa();
      expect(data).to.be.equal('function');
    });

    it('should be able to access addons added previously', () => {
      const api = new ClientAPI({});
      let data;

      api.setAddon({
        aa() {
          data = 'foo';
        },
      });

      api.setAddon({
        bb() {
          this.aa();
        },
      });

      api.storiesOf('none').bb();
      expect(data).to.be.equal('foo');
    });
  });

  describe('addDecorator', () => {
    it('should add local decorators', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');
      localApi.addDecorator(function (fn) {
        return `aa-${fn()}`;
      });

      localApi.add('storyName', () => ('Hello'));
      expect(storyStore.stories[0].fn()).to.be.equal('aa-Hello');
    });

    it('should add global decorators', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      api.addDecorator(function (fn) {
        return `bb-${fn()}`;
      });
      const localApi = api.storiesOf('none');

      localApi.add('storyName', () => ('Hello'));
      expect(storyStore.stories[0].fn()).to.be.equal('bb-Hello');
    });

    it('should utilize both decorators at once', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');

      api.addDecorator(function (fn) {
        return `aa-${fn()}`;
      });
      localApi.addDecorator(function (fn) {
        return `bb-${fn()}`;
      });

      localApi.add('storyName', () => ('Hello'));
      expect(storyStore.stories[0].fn()).to.be.equal('aa-bb-Hello');
    });
  });
});
