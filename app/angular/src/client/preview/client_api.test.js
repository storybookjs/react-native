/* eslint-disable no-underscore-dangle */

import ClientAPI from './client_api';

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

  hasStory(kind, name) {
    return Boolean(this.getStory(kind, name));
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
      expect(data).toBe('foo');
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

      api
        .storiesOf('none')
        .aa()
        .bb();
      expect(data).toEqual(['foo', 'bar']);
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
      expect(data).toBe('function');
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
      expect(data).toBe('foo');
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
      expect(data).toBe(kind);
    });
  });

  describe('addDecorator', () => {
    it('should add local decorators', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');
      localApi.addDecorator(fn => `aa-${fn()}`);

      localApi.add('storyName', () => 'Hello');
      expect(storyStore.stories[0].fn()).toBe('aa-Hello');
    });

    it('should add global decorators', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      api.addDecorator(fn => `bb-${fn()}`);
      const localApi = api.storiesOf('none');

      localApi.add('storyName', () => 'Hello');
      expect(storyStore.stories[0].fn()).toBe('bb-Hello');
    });

    it('should utilize both decorators at once', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');

      api.addDecorator(fn => `aa-${fn()}`);
      localApi.addDecorator(fn => `bb-${fn()}`);

      localApi.add('storyName', () => 'Hello');
      expect(storyStore.stories[0].fn()).toBe('aa-bb-Hello');
    });

    it('should pass the context', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');
      localApi.addDecorator(fn => `aa-${fn()}`);

      localApi.add('storyName', ({ kind, story }) => `${kind}-${story}`);

      const kind = 'dfdfd';
      const story = 'ef349ff';

      const result = storyStore.stories[0].fn({ kind, story });
      expect(result).toBe(`aa-${kind}-${story}`);
    });

    it('should have access to the context', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none');
      localApi.addDecorator((fn, { kind, story }) => `${kind}-${story}-${fn()}`);

      localApi.add('storyName', () => 'Hello');

      const kind = 'dfdfd';
      const story = 'ef349ff';

      const result = storyStore.stories[0].fn({ kind, story });
      expect(result).toBe(`${kind}-${story}-Hello`);
    });
  });

  describe('clearDecorators', () => {
    it('should remove all global decorators', () => {
      const api = new ClientAPI({});
      api._globalDecorators = 1234;
      api.clearDecorators();
      expect(api._globalDecorators).toEqual([]);
    });
  });

  describe('getStorybook', () => {
    it('should return storybook when empty', () => {
      const storyStore = new StoryStore();
      const api = new ClientAPI({ storyStore });
      const book = api.getStorybook();
      expect(book).toEqual([]);
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
      expect(book).toEqual([
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
