/* eslint-disable no-underscore-dangle */
import { logger } from '@storybook/client-logger';
import addons, { mockChannel } from '@storybook/addons';
import ClientApi from './client_api';
import ConfigApi from './config_api';
import StoryStore from './story_store';

export const getContext = (() => decorateStory => {
  const channel = mockChannel();
  addons.setChannel(channel);
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
      const { clientApi } = getContext(undefined);
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
      const { clientApi } = getContext(undefined);
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
      const { clientApi } = getContext(undefined);
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
      const { clientApi } = getContext(undefined);
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
      const { clientApi } = getContext(undefined);
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

  describe('addParameters', () => {
    it('should add parameters', () => {
      const { clientApi } = getContext(undefined);

      clientApi.addParameters({ a: '1' });

      // @ts-ignore
      expect(clientApi._globalParameters).toEqual({ a: '1', options: {}, docs: {} });
    });

    it('should merge options', () => {
      const { clientApi } = getContext(undefined);

      clientApi.addParameters({ options: { a: '1' } });
      clientApi.addParameters({ options: { b: '2' } });

      // @ts-ignore
      expect(clientApi._globalParameters).toEqual({ options: { a: '1', b: '2' }, docs: {} });
    });

    it('should override specific properties in options', () => {
      const { clientApi } = getContext(undefined);

      clientApi.addParameters({ backgrounds: ['value'], options: { a: '1', b: '3' } });
      clientApi.addParameters({ options: { a: '2' } });

      // @ts-ignore
      expect(clientApi._globalParameters).toEqual({
        backgrounds: ['value'],
        options: { a: '2', b: '3' },
        docs: {},
      });
    });

    it('should replace top level properties and override specific properties in options', () => {
      const { clientApi } = getContext(undefined);

      clientApi.addParameters({ backgrounds: ['value'], options: { a: '1', b: '3' } });
      clientApi.addParameters({ backgrounds: [], options: { a: '2' } });

      // @ts-ignore
      expect(clientApi._globalParameters).toEqual({
        backgrounds: [],
        options: { a: '2', b: '3' },
        docs: {},
      });
    });

    it('should deep merge in options', () => {
      const { clientApi } = getContext(undefined);

      clientApi.addParameters({ options: { a: '1', b: '2', theming: { c: '3' } } });
      clientApi.addParameters({ options: { theming: { c: '4', d: '5' } } });

      // @ts-ignore
      expect(clientApi._globalParameters).toEqual({
        options: { a: '1', b: '2', theming: { c: '4', d: '5' } },
        docs: {},
      });
    });
  });

  describe('addDecorator', () => {
    it('should add local decorators', () => {
      const {
        clientApi: { storiesOf },
        storyStore,
      } = getContext(undefined);

      storiesOf('kind', module)
        .addDecorator(fn => `aa-${fn()}`)
        .add('name', () => 'Hello');

      expect(storyStore.fromId('kind--name').storyFn()).toBe('aa-Hello');
    });

    it('should add global decorators', () => {
      const {
        clientApi: { addDecorator, storiesOf },
        storyStore,
      } = getContext(undefined);

      addDecorator(fn => `bb-${fn()}`);

      storiesOf('kind', module).add('name', () => 'Hello');
      const f = storyStore.fromId('x');

      expect(storyStore.fromId('kind--name').storyFn()).toBe('bb-Hello');
    });

    it('should utilize both decorators at once', () => {
      const {
        clientApi: { addDecorator, storiesOf },
        storyStore,
      } = getContext(undefined);

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
      } = getContext(undefined);

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
      } = getContext(undefined);

      storiesOf('kind', module)
        .addDecorator((fn, { kind, name }) => `${kind}-${name}-${fn()}`)
        .add('name', () => 'Hello');

      const result = storyStore.fromId('kind--name').storyFn();
      expect(result).toBe(`kind-name-Hello`);
    });
  });

  describe('clearDecorators', () => {
    it('should remove all global decorators', () => {
      const { clientApi } = getContext(undefined);

      // @ts-ignore
      clientApi._globalDecorators = 1234;
      clientApi.clearDecorators();

      // @ts-ignore
      expect(clientApi._globalDecorators).toEqual([]);
    });
  });

  describe('getStorybook', () => {
    it('should transform the storybook to an array with filenames', () => {
      const {
        clientApi: { getStorybook, storiesOf },
      } = getContext(undefined);

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
      } = getContext(undefined);

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

    it('should stringify ids from module', () => {
      const {
        clientApi: { getStorybook, storiesOf },
      } = getContext(undefined);

      const fn = jest.fn();
      storiesOf('kind', { id: 1211 }).add('name', fn);

      const storybook = getStorybook();

      expect(storybook).toEqual([
        {
          kind: 'kind',
          fileName: '1211',
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
      id = 'mock-module-id';

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
      } = getContext(undefined);
      const module = new MockModule();

      expect(storyStore.getRevision()).toEqual(0);

      storiesOf('kind', module);

      module.hot.reload();

      expect(storyStore.getRevision()).toEqual(1);
    });

    it('should replace a kind when the module reloads', () => {
      const {
        clientApi: { storiesOf, getStorybook },
      } = getContext(undefined);
      const module = new MockModule();

      const stories = [jest.fn(), jest.fn()];

      expect(getStorybook()).toEqual([]);

      storiesOf('kind', module).add('story', stories[0]);

      const firstStorybook = getStorybook();
      expect(firstStorybook).toEqual([
        {
          fileName: expect.any(String),
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
          fileName: expect.any(String),
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
      } = getContext(undefined);

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
        docs: expect.any(Object),
      });
    });

    it('combines object parameters per-key', () => {
      const {
        storyStore,
        clientApi: { storiesOf, addParameters },
      } = getContext(undefined);

      addParameters({
        addon1: 'global string value',
        addon2: ['global array value'],
        addon3: {
          global: true,
          sub: { global: true },
        },
        options: expect.any(Object),
        docs: expect.any(Object),
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
        docs: expect.any(Object),
      });
    });
  });

  describe('storiesOf', () => {
    describe('add', () => {
      it('should replace stories when adding the same story', () => {
        const stories = [jest.fn().mockReturnValue('story1'), jest.fn().mockReturnValue('story2')];

        const {
          clientApi: { storiesOf, getStorybook },
        } = getContext(undefined);

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
        // @ts-ignore
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
