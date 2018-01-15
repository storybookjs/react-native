import StoryStore from './story_store';

describe('preview.story_store', () => {
  describe('dumpStoryBook', () => {
    it('should return nothing when empty', () => {
      const store = new StoryStore();
      expect(store.dumpStoryBook()).toEqual([]);
    });

    it('should return storybook with stories', () => {
      const store = new StoryStore();

      store.addStory('kind-1', 'story-1.1', () => 0);
      store.addStory('kind-1', 'story-1.2', () => 0);
      store.addStory('kind-2', 'story-2.1', () => 0);
      store.addStory('kind-2', 'story-2.2', () => 0);

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
      const store = new StoryStore();
      store.addStory('kind-1', 'story-1.1', () => 0, 'foo.js');
      store.addStory('kind-1', 'story-1.2', () => 0, 'foo-2.js');
      store.addStory('kind-2', 'story-2.1', () => 0, 'bar.js');

      expect(store.getStoryFileName('kind-1')).toBe('foo.js');
      expect(store.getStoryFileName('kind-2')).toBe('bar.js');
    });
  });

  describe('removeStoryKind', () => {
    it('should not error even if there is no kind', () => {
      const store = new StoryStore();
      store.removeStoryKind('kind');
    });
  });
});
