import createChannel from '@storybook/channel-postmessage';
import StoryStore from './story_store';

const channel = createChannel({ page: 'preview' });

const make = (kind, name, story, parameters = {}) => [
  { kind, name, story, getDecorated: () => story, parameters },
];

describe('preview.story_store', () => {
  describe('raw storage', () => {
    it('stores basic kinds and stories w/ correct keys', () => {
      const store = new StoryStore({ channel });
      store.addStory(...make('a', '1', () => 0));
      store.addStory(...make('a', '2', () => 0));
      store.addStory(...make('b', '1', () => 0));

      const extracted = store.extract();
      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(extracted)).toEqual(['a', 'a--1', 'a--2', 'b', 'b--1']);
      expect(extracted.a).toMatchObject({
        path: 'a',
        children: ['a--1', 'a--2'],
        isRoot: true,
        isComponent: true,
        depth: 0,
      });

      expect(extracted['a--1']).toMatchObject({
        id: 'a--1',
        path: 'a--1',
        parent: 'a',
        kind: 'a',
        name: '1',
        parameters: {},
        depth: 1,
        isRoot: false,
        isComponent: false,
      });
    });

    it('stores root and groups also', () => {
      const store = new StoryStore({ channel });
      store.addStory(...make('a|b/c/d', '1', () => 0));

      const extracted = store.extract();
      // We need exact key ordering, even if in theory JS doens't guarantee it
      expect(Object.keys(extracted)).toEqual(['a', 'a-b', 'a-b-c', 'a-b-c-d', 'a-b-c-d--1']);
      expect(extracted.a).toMatchObject({
        name: 'a',
        isRoot: true,
        isComponent: false,
        children: ['a-b'],
      });
      expect(extracted['a-b']).toMatchObject({
        name: 'b',
        isRoot: false,
        isComponent: false,
        children: ['a-b-c'],
        parent: 'a',
      });
      expect(extracted['a-b-c']).toMatchObject({
        name: 'c',
        isRoot: false,
        isComponent: false,
        children: ['a-b-c-d'],
        parent: 'a-b',
      });
      expect(extracted['a-b-c-d']).toMatchObject({
        name: 'd',
        isRoot: false,
        isComponent: true,
        children: ['a-b-c-d--1'],
        parent: 'a-b-c',
      });
      expect(extracted['a-b-c-d--1']).toMatchObject({
        kind: 'a|b/c/d',
        name: '1',
        isRoot: false,
        isComponent: false,
        parent: 'a-b-c-d',
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
      const story = jest.fn();
      const parameters = {
        fileName: 'foo.js',
        parameter: 'value',
      };
      store.addStory(...make('kind', 'name', story, parameters));

      const storyWithContext = store.getStoryWithContext('kind', 'name');
      storyWithContext();
      expect(story).toHaveBeenCalledWith({
        kind: 'kind',
        story: 'name',
        parameters,
      });
    });
  });
});
