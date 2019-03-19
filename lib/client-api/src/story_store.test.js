import { history, document } from 'global';
import createChannel from '@storybook/channel-postmessage';
import Events from '@storybook/core-events';
import { toId } from '@storybook/router/utils';

import StoryStore from './story_store';
import { defaultDecorateStory } from './client_api';

jest.mock('global', () => ({
  history: { replaceState: jest.fn() },
  window: {
    addEventListener: jest.fn(),
  },
  document: {
    location: {
      pathname: 'pathname',
      search: '',
    },
    addEventListener: jest.fn(),
  },
}));

jest.mock('@storybook/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const channel = createChannel({ page: 'preview' });

const make = (kind, name, storyFn, parameters = {}) => [
  {
    kind,
    name,
    storyFn,
    parameters,
    id: toId(kind, name),
  },
  {
    applyDecorators: defaultDecorateStory,
    getDecorators: () => [],
  },
];

describe('preview.story_store', () => {
  describe('raw storage', () => {
    it('stores hash object', () => {
      const store = new StoryStore({ channel });
      store.addStory(...make('a', '1', () => 0));
      store.addStory(...make('a', '2', () => 0));
      store.addStory(...make('b', '1', () => 0));

      const extracted = store.extract();

      // We need exact key ordering, even if in theory JS doesns't guarantee it
      expect(Object.keys(extracted)).toEqual(['a--1', 'a--2', 'b--1']);

      // content of item should be correct
      expect(extracted['a--1']).toMatchObject({
        id: 'a--1',
        kind: 'a',
        name: '1',
        parameters: expect.any(Object),
      });
    });
  });

  describe('dumpStoryBook', () => {
    it('should return nothing when empty', () => {
      const store = new StoryStore({ channel });
      expect(store.dumpStoryBook()).toEqual([]);
    });

    it('should return storybook with stories', () => {
      const store = new StoryStore({ channel });

      store.addStory(...make('kind-1', 'story-1.1', () => 0));
      store.addStory(...make('kind-1', 'story-1.2', () => 0));
      store.addStory(...make('kind-2', 'story-2.1', () => 0));
      store.addStory(...make('kind-2', 'story-2.2', () => 0));

      expect(store.dumpStoryBook()).toEqual([
        {
          kind: 'kind-1',
          stories: ['story-1.1', 'story-1.2'],
        },
        {
          kind: 'kind-2',
          stories: ['story-2.1', 'story-2.2'],
        },
      ]);
    });
  });

  describe('getStoryFileName', () => {
    it('should return the filename of the first story passed for the kind', () => {
      const store = new StoryStore({ channel });
      store.addStory(...make('kind-1', 'story-1.1', () => 0, { fileName: 'foo.js' }));
      store.addStory(...make('kind-1', 'story-1.2', () => 0, { fileName: 'foo-2.js' }));
      store.addStory(...make('kind-2', 'story-2.1', () => 0, { fileName: 'bar.js' }));

      expect(store.getStoryFileName('kind-1')).toBe('foo.js');
      expect(store.getStoryFileName('kind-2')).toBe('bar.js');
    });
  });

  describe('removeStoryKind', () => {
    it('should not error even if there is no kind', () => {
      const store = new StoryStore({ channel });
      store.removeStoryKind('kind');
    });
  });

  describe('getStoryAndParameters', () => {
    it('should return parameters that we passed in', () => {
      const store = new StoryStore({ channel });
      const story = jest.fn();
      const parameters = {
        fileName: 'foo.js',
        parameter: 'value',
      };
      store.addStory(...make('kind', 'name', story, parameters));

      expect(store.getStoryAndParameters('kind', 'name').parameters).toEqual(parameters);
    });
  });

  describe('getStoryWithContext', () => {
    it('should return a function that calls the story with the context', () => {
      const store = new StoryStore({ channel });
      const storyFn = jest.fn();
      const parameters = {
        fileName: 'foo.js',
        parameter: 'value',
      };
      store.addStory(...make('kind', 'name', storyFn, parameters));

      const storyWithContext = store.getStoryWithContext('kind', 'name');
      storyWithContext();
      expect(storyFn).toHaveBeenCalledWith({
        id: 'kind--name',
        name: 'name',
        kind: 'kind',
        story: 'name',
        parameters,
      });
    });
  });

  describe('setPath', () => {
    it('preserves custom URL params', () => {
      const store = new StoryStore({ channel });

      store.setPath('story--id', { foo: 'bar' });
      expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?foo=bar&id=story--id');
    });
  });

  describe('STORY_INIT', () => {
    const storyFn = () => 0;

    it('supports path params', () => {
      document.location = {
        pathname: 'pathname',
        search: '?path=/story/kind--story&bar=baz',
      };
      const store = new StoryStore({ channel });
      store.addStory(...make('kind', 'story', storyFn));
      store.setSelection = jest.fn();

      store.emit(Events.STORY_INIT);
      expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?bar=baz&id=kind--story');
      expect(store.setSelection).toHaveBeenCalled();
      expect(store.setSelection.mock.calls[0][0].getDecorated()).toEqual(storyFn);
    });

    it('supports story kind/name params', () => {
      document.location = {
        pathname: 'pathname',
        search: '?selectedKind=kind&selectedStory=story&bar=baz',
      };
      const store = new StoryStore({ channel });
      store.addStory(...make('kind', 'story', storyFn));
      store.setSelection = jest.fn();

      store.emit(Events.STORY_INIT);
      expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?bar=baz&id=kind--story');
      expect(store.setSelection).toHaveBeenCalled();
      expect(store.setSelection.mock.calls[0][0].getDecorated()).toEqual(storyFn);
    });
  });
});
