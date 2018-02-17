/* eslint no-underscore-dangle: 0 */

import ClientAPI from './client_api';

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

      api.storiesOf('none', module).aa();
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
        .storiesOf('none', module)
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

      api.storiesOf('none', module).aa();
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

      api.storiesOf('none', module).bb();
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

      api.storiesOf(kind, module).aa();
      expect(data).toBe(kind);
    });
  });

  describe('addDecorator', () => {
    class MockStoryStore {
      stories = [];
      addStory(kind, name, fn, fileName) {
        this.stories.push({ kind, name, fn, fileName });
      }
      hasStory(k, n) {
        return this.stories.find(({ kind, name }) => kind === k && name === n);
      }
    }

    it('should add local decorators', () => {
      const storyStore = new MockStoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none', module);
      localApi.addDecorator(fn => `aa-${fn()}`);

      localApi.add('storyName', () => 'Hello');
      expect(storyStore.stories[0].fn()).toBe('aa-Hello');
    });

    it('should add global decorators', () => {
      const storyStore = new MockStoryStore();
      const api = new ClientAPI({ storyStore });
      api.addDecorator(fn => `bb-${fn()}`);
      const localApi = api.storiesOf('none', module);

      localApi.add('storyName', () => 'Hello');
      expect(storyStore.stories[0].fn()).toBe('bb-Hello');
    });

    it('should utilize both decorators at once', () => {
      const storyStore = new MockStoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none', module);

      api.addDecorator(fn => `aa-${fn()}`);
      localApi.addDecorator(fn => `bb-${fn()}`);

      localApi.add('storyName', () => 'Hello');
      expect(storyStore.stories[0].fn()).toBe('aa-bb-Hello');
    });

    it('should pass the context', () => {
      const storyStore = new MockStoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none', module);
      localApi.addDecorator(fn => `aa-${fn()}`);

      localApi.add('storyName', ({ kind, story }) => `${kind}-${story}`);

      const kind = 'dfdfd';
      const story = 'ef349ff';

      const result = storyStore.stories[0].fn({ kind, story });
      expect(result).toBe(`aa-${kind}-${story}`);
    });

    it('should have access to the context', () => {
      const storyStore = new MockStoryStore();
      const api = new ClientAPI({ storyStore });
      const localApi = api.storiesOf('none', module);
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
    it('should transform the storybook to an array with filenames', () => {
      class MockStoryStore {
        getStoryKinds() {
          return ['kind-1', 'kind-2'];
        }

        getStoryFileName(kind) {
          return `${kind}.js`;
        }

        getStories() {
          return ['a', 'b'];
        }

        getStory(kind, name) {
          return `${kind}:${name}`;
        }
      }

      const api = new ClientAPI({ storyStore: new MockStoryStore() });
      const book = api.getStorybook();
      expect(book).toEqual([
        {
          kind: 'kind-1',
          fileName: 'kind-1.js',
          stories: [{ name: 'a', render: 'kind-1:a' }, { name: 'b', render: 'kind-1:b' }],
        },
        {
          kind: 'kind-2',
          fileName: 'kind-2.js',
          stories: [{ name: 'a', render: 'kind-2:a' }, { name: 'b', render: 'kind-2:b' }],
        },
      ]);
    });
  });

  describe('reads filename from module', () => {
    const api = new ClientAPI();
    const story = () => 0;
    api.storiesOf('kind', { filename: 'foo.js' }).add('story', story);
    expect(api.getStorybook()).toEqual([
      { kind: 'kind', fileName: 'foo.js', stories: [{ name: 'story', render: story }] },
    ]);
  });

  describe('hot module loading', () => {
    class MockModule {
      hot = {
        callbacks: [],
        dispose(fn) {
          this.callbacks.push(fn);
        },
        reload() {
          this.callbacks.forEach(fn => fn());
        },
      };
    }

    it('should increment store revision when the module reloads', () => {
      const api = new ClientAPI();
      expect(api._storyStore.getRevision()).toEqual(0);

      const module = new MockModule();
      api.storiesOf('kind', module);
      module.hot.reload();

      expect(api._storyStore.getRevision()).toEqual(1);
    });

    it('should replace a kind when the module reloads', () => {
      const module = new MockModule();
      const stories = [jest.fn(), jest.fn()];

      const api = new ClientAPI();
      expect(api.getStorybook()).toEqual([]);

      api.storiesOf('kind', module).add('story', stories[0]);
      expect(api.getStorybook()).toEqual([
        {
          kind: 'kind',
          stories: [{ name: 'story', render: stories[0] }],
        },
      ]);

      module.hot.reload();
      expect(api.getStorybook()).toEqual([]);

      api.storiesOf('kind', module).add('story', stories[1]);
      expect(api.getStorybook()).toEqual([
        {
          kind: 'kind',
          stories: [{ name: 'story', render: stories[1] }],
        },
      ]);
    });
  });
});
