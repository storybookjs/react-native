import { logger } from '@storybook/client-logger';
import { mockChannel } from '@storybook/addons';
import ClientApi from './client_api';
import ConfigApi from './config_api';
import StoryStore from './story_store';

export const getContext = (() => decorateStory => {
  const channel = mockChannel();
  const storyStore = new StoryStore({ channel });
  const clientApi = new ClientApi({ storyStore, decorateStory });
  const { clearDecorators } = clientApi;
  const configApi = new ConfigApi({ clearDecorators, storyStore, channel, clientApi });

  return {
    configApi,
    storyStore,
    channel,
    clientApi,
  };
})();

jest.mock('@storybook/client-logger', () => ({
  logger: { warn: jest.fn(), log: jest.fn() },
}));

describe('preview.client_api', () => {
  describe('setAddon', () => {
    it('should register addons', () => {
      const { clientApi } = getContext();
      let data;

      clientApi.setAddon({
        aa() {
          data = 'foo';
        },
      });

      clientApi.storiesOf('none', module).aa();
      expect(data).toBe('foo');
    });

    it('should not remove previous addons', () => {
      const { clientApi } = getContext();
      const data = [];

      clientApi.setAddon({
        aa() {
          data.push('foo');
        },
      });

      clientApi.setAddon({
        bb() {
          data.push('bar');
        },
      });

      clientApi
        .storiesOf('none', module)
        .aa()
        .bb();
      expect(data).toEqual(['foo', 'bar']);
    });

    it('should call with the clientApi context', () => {
      const { clientApi } = getContext();
      let data;

      clientApi.setAddon({
        aa() {
          data = typeof this.add;
        },
      });

      clientApi.storiesOf('none', module).aa();
      expect(data).toBe('function');
    });

    it('should be able to access addons added previously', () => {
      const { clientApi } = getContext();
      let data;

      clientApi.setAddon({
        aa() {
          data = 'foo';
        },
      });

      clientApi.setAddon({
        bb() {
          this.aa();
        },
      });

      clientApi.storiesOf('none', module).bb();
      expect(data).toBe('foo');
    });

    it('should be able to access the current kind', () => {
      const { clientApi } = getContext();
      const kind = 'dfdwf3e3';
      let data;

      clientApi.setAddon({
        aa() {
          data = this.kind;
        },
      });

      clientApi.storiesOf(kind, module).aa();
      expect(data).toBe(kind);
    });
  });

  describe('addDecorator', () => {
    it('should add local decorators', () => {
      const {
        clientApi: { storiesOf },
        storyStore,
      } = getContext();

      storiesOf('kind', module)
        .addDecorator(fn => `aa-${fn()}`)
        .add('name', () => 'Hello');

      expect(storyStore.fromId('kind--name').storyFn()).toBe('aa-Hello');
    });

    it('should add global decorators', () => {
      const {
        clientApi: { addDecorator, storiesOf },
        storyStore,
      } = getContext();

      addDecorator(fn => `bb-${fn()}`);

      storiesOf('kind', module).add('name', () => 'Hello');

      expect(storyStore.fromId('kind--name').storyFn()).toBe('bb-Hello');
    });

    it('should utilize both decorators at once', () => {
      const {
        clientApi: { addDecorator, storiesOf },
        storyStore,
      } = getContext();

      addDecorator(fn => `aa-${fn()}`);

      storiesOf('kind', module)
        .addDecorator(fn => `bb-${fn()}`)
        .add('name', () => 'Hello');

      expect(storyStore.fromId('kind--name').storyFn()).toBe('aa-bb-Hello');
    });

    it('should pass the context', () => {
      const {
        clientApi: { storiesOf },
        storyStore,
      } = getContext();

      storiesOf('kind', module)
        .addDecorator(fn => `aa-${fn()}`)
        .add('name', c => `${c.kind}-${c.name}`);

      const result = storyStore.fromId('kind--name').storyFn();
      expect(result).toBe(`aa-kind-name`);
    });

    it('should have access to the context', () => {
      const {
        clientApi: { storiesOf },
        storyStore,
      } = getContext();

      storiesOf('kind', module)
        .addDecorator((fn, { kind, name }) => `${kind}-${name}-${fn()}`)
        .add('name', () => 'Hello');

      const result = storyStore.fromId('kind--name').storyFn();
      expect(result).toBe(`kind-name-Hello`);
    });
  });

  describe('clearDecorators', () => {
    it('should remove all global decorators', () => {
      const { clientApi } = getContext();
      // eslint-disable-next-line no-underscore-dangle
      clientApi._globalDecorators = 1234;
      clientApi.clearDecorators();
      // eslint-disable-next-line no-underscore-dangle
      expect(clientApi._globalDecorators).toEqual([]);
    });
  });

  describe('getStorybook', () => {
    it('should transform the storybook to an array with filenames', () => {
      const {
        clientApi: { getStorybook, storiesOf },
      } = getContext();

      let book;

      book = getStorybook();
      expect(book).toEqual([]);

      storiesOf('kind 1', module)
        .add('name 1', () => '1')
        .add('name 2', () => '2');

      storiesOf('kind 2', module)
        .add('name 1', () => '1')
        .add('name 2', () => '2');

      book = getStorybook();

      expect(book).toEqual([
        expect.objectContaining({
          fileName: expect.any(String),
          kind: 'kind 1',
          stories: [
            {
              name: 'name 1',
              render: expect.any(Function),
            },
            {
              name: 'name 2',
              render: expect.any(Function),
            },
          ],
        }),
        expect.objectContaining({
          fileName: expect.any(String),
          kind: 'kind 2',
          stories: [
            {
              name: 'name 1',
              render: expect.any(Function),
            },
            {
              name: 'name 2',
              render: expect.any(Function),
            },
          ],
        }),
      ]);
    });

    it('reads filename from module', () => {
      const {
        clientApi: { getStorybook, storiesOf },
      } = getContext();

      const fn = jest.fn();
      storiesOf('kind', { id: 'foo.js' }).add('name', fn);

      const storybook = getStorybook();

      expect(storybook).toEqual([
        {
          kind: 'kind',
          fileName: 'foo.js',
          stories: [
            {
              name: 'name',
              render: expect.any(Function),
            },
          ],
        },
      ]);
    });

    it('should ignore non-string ids from module', () => {
      const {
        clientApi: { getStorybook, storiesOf },
      } = getContext();

      const fn = jest.fn();
      storiesOf('kind', { id: 1211 }).add('name', fn);

      const storybook = getStorybook();

      expect(storybook).toEqual([
        {
          kind: 'kind',
          stories: [
            {
              name: 'name',
              render: expect.any(Function),
            },
          ],
        },
      ]);
    });
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
      const {
        storyStore,
        clientApi: { storiesOf },
      } = getContext();
      const module = new MockModule();

      expect(storyStore.getRevision()).toEqual(0);

      storiesOf('kind', module);

      module.hot.reload();

      expect(storyStore.getRevision()).toEqual(1);
    });

    it('should replace a kind when the module reloads', () => {
      const {
        clientApi: { storiesOf, getStorybook },
      } = getContext();
      const module = new MockModule();

      const stories = [jest.fn(), jest.fn()];

      expect(getStorybook()).toEqual([]);

      storiesOf('kind', module).add('story', stories[0]);

      const firstStorybook = getStorybook();
      expect(firstStorybook).toEqual([
        {
          kind: 'kind',
          stories: [{ name: 'story', render: expect.anything() }],
        },
      ]);

      firstStorybook[0].stories[0].render();
      expect(stories[0]).toHaveBeenCalled();

      module.hot.reload();
      expect(getStorybook()).toEqual([]);

      storiesOf('kind', module).add('story', stories[1]);

      const secondStorybook = getStorybook();
      expect(secondStorybook).toEqual([
        {
          kind: 'kind',
          stories: [{ name: 'story', render: expect.anything() }],
        },
      ]);
      secondStorybook[0].stories[0].render();
      expect(stories[1]).toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });

  describe('parameters', () => {
    it('collects parameters across different modalities', () => {
      const {
        storyStore,
        clientApi: { storiesOf, addParameters },
      } = getContext();

      addParameters({ a: 'global', b: 'global', c: 'global' });

      const kind = storiesOf('kind', module);
      kind.addParameters({ b: 'kind', c: 'kind' });

      kind.add('name', jest.fn(), { c: 'story' });

      expect(storyStore.fromId('kind--name').parameters).toEqual({
        a: 'global',
        b: 'kind',
        c: 'story',
        fileName: expect.any(String),
        options: expect.any(Object),
      });
    });

    it('combines object parameters per-key', () => {
      const {
        storyStore,
        clientApi: { storiesOf, addParameters },
      } = getContext();

      addParameters({
        addon1: 'global string value',
        addon2: ['global array value'],
        addon3: {
          global: true,
          sub: { global: true },
        },
        options: expect.any(Object),
      });

      storiesOf('kind', module)
        .addParameters({
          addon1: 'local string value',
          addon2: ['local array value'],
          addon3: {
            local: true,
            sub: {
              local: true,
            },
          },
        })
        .add('name', jest.fn(), {
          addon1: 'local string value',
          addon2: ['local array value'],
          addon3: {
            local: true,
            sub: {
              local: true,
            },
          },
        });

      expect(storyStore.fromId('kind--name').parameters).toEqual({
        addon1: 'local string value',
        addon2: ['local array value'],
        addon3: {
          global: true,
          local: true,
          sub: {
            global: true,
            local: true,
          },
        },
        fileName: expect.any(String),
        options: expect.any(Object),
      });
    });
  });

  describe('storiesOf', () => {
    describe('add', () => {
      it('should replace stories when adding the same story', () => {
        const stories = [jest.fn().mockReturnValue('story1'), jest.fn().mockReturnValue('story2')];

        const {
          clientApi: { storiesOf, getStorybook },
        } = getContext();

        expect(getStorybook()).toEqual([]);

        storiesOf('kind', module).add('story', stories[0]);
        {
          const book = getStorybook();
          expect(book).toHaveLength(1);

          const entry = book[0];
          expect(entry.kind).toMatch('kind');
          expect(entry.stories).toHaveLength(1);
          expect(entry.stories[0].name).toBe('story');

          // v3 returns the same function we passed in
          if (jest.isMockFunction(entry.stories[0].render)) {
            expect(entry.stories[0].render).toBe(stories[0]);
          } else {
            expect(entry.stories[0].render()).toBe('story1');
          }
        }

        storiesOf('kind', module).add('story', stories[1]);
        expect(logger.warn.mock.calls[0][0]).toMatch(
          /Story with id kind--story already exists in the store/
        );
        {
          const book = getStorybook();
          expect(book).toHaveLength(1);

          const entry = book[0];
          expect(entry.kind).toMatch('kind');
          expect(entry.stories).toHaveLength(1);
          expect(entry.stories[0].name).toBe('story');

          // v3 returns the same function we passed in
          if (jest.isMockFunction(entry.stories[0].render)) {
            expect(entry.stories[0].render).toBe(stories[0]);
          } else {
            expect(entry.stories[0].render()).toBe('story2');
          }
        }
      });
    });
  });
});
