import { expect } from 'chai';
import ClientAPI from '../client_api';

const { describe, it } = global;

class StoryStore {
  constructor() {
    this.stories = [];
  }

  addStory(kind, story, fn) {
    this.stories.push({ kind, story, fn });
  }

  getStoryKinds() {
    return this.stories.reduce((kinds, info) => {
      if (kinds.indexOf(info.kind) === -1) {
        kinds.push(info.kind);
      }
      return kinds;
    }, []);
  }

  getStories(kind) {
    return this.stories.reduce((stories, info) => {
      if (info.kind === kind) {
        stories.push(info.story);
      }
      return stories;
    }, []);
  }

  getStory(kind, name) {
    return this.stories.reduce((fn, info) => {
      if (!fn && info.kind === kind && info.story === name) {
        return info.fn;
      }
      return fn;
    }, null);
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

    it('should be able to access the current kind', () => {
      const api = new ClientAPI({});
      const kind = 'dfdwf3e3';
      let data;

      api.setAddon({
        aa() {
          data = this.kind;
        },
      });

      api.storiesOf(kind).aa();
      expect(data).to.be.equal(kind);
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

    it('should pass the context', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');
      localApi.addDecorator(function (fn) {
        return `aa-${fn()}`;
      });

      localApi.add('storyName', ({ kind, story }) => (`${kind}-${story}`));

      const kind = 'dfdfd';
      const story = 'ef349ff';

      const result = storyStore.stories[0].fn({ kind, story });
      expect(result).to.be.equal(`aa-${kind}-${story}`);
    });

    it('should have access to the context', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');
      localApi.addDecorator(function (fn, { kind, story }) {
        return `${kind}-${story}-${fn()}`;
      });

      localApi.add('storyName', () => ('Hello'));

      const kind = 'dfdfd';
      const story = 'ef349ff';

      const result = storyStore.stories[0].fn({ kind, story });
      expect(result).to.be.equal(`${kind}-${story}-Hello`);
    });
  });

  describe('clearDecorators', () => {
    it('should remove all global decorators', () => {
      const api = new ClientAPI({});
      api._globalDecorators = 1234;
      api.clearDecorators();
      expect(api._globalDecorators).to.deep.equal([]);
    });
  });

  describe('getStorybook', () => {
    it('should return storybook when empty', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const book = api.getStorybook();
      expect(book).to.deep.equal([]);
    });

    it('should return storybook with stories', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const functions = {
        'story-1.1': () => 'story-1.1',
        'story-1.2': () => 'story-1.2',
        'story-2.1': () => 'story-2.1',
        'story-2.2': () => 'story-2.2',
      };
      const kind1 = api.storiesOf('kind-1');
      kind1.add('story-1.1', functions['story-1.1']);
      kind1.add('story-1.2', functions['story-1.2']);
      const kind2 = api.storiesOf('kind-2');
      kind2.add('story-2.1', functions['story-2.1']);
      kind2.add('story-2.2', functions['story-2.2']);
      const book = api.getStorybook();
      expect(book).to.deep.equal([
        {
          kind: 'kind-1',
          stories: [
            { name: 'story-1.1', render: functions['story-1.1'] },
            { name: 'story-1.2', render: functions['story-1.2'] },
          ],
        },
        {
          kind: 'kind-2',
          stories: [
            { name: 'story-2.1', render: functions['story-2.1'] },
            { name: 'story-2.2', render: functions['story-2.2'] },
          ],
        },
      ]);
    });
  });
});
