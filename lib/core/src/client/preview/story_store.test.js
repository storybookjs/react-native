import createChannel from '@storybook/channel-postmessage';
import StoryStore from './story_store';

const channel = createChannel({ page: 'preview' });

const make = (kind, name, story, parameters = {}) => [
  { kind, name, story, getDecorated: () => story, parameters },
  { rootSeparator: '|', groupSeparator: /\// },
];

describe('preview.story_store', () => {
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
