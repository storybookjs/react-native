const { describe, it, beforeEach } = global;
import { expect } from 'chai';
import UUID from 'uuid';

import StoryStore from '../story_store';
const storyStore = new StoryStore();

describe('client.StoryStore', () => {
  beforeEach(() => storyStore.clean());

  describe('addStory', () => {
    it('should add the first story properly', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);

      expect(storyStore.getStory(kind, 'name')).to.be.equal(story);
    });

    it('should add another story of the previous kind', () => {
      const kind = UUID.v4();
      function story1() {}
      function story2() {}
      storyStore.addStory(kind, 'name1', story1);
      storyStore.addStory(kind, 'name2', story2);

      expect(storyStore.getStory(kind, 'name1')).to.be.equal(story1);
      expect(storyStore.getStory(kind, 'name2')).to.be.equal(story2);
    });

    it('should replace the same story if came again', () => {
      const kind = UUID.v4();
      function story1() {}
      function story2() {}
      storyStore.addStory(kind, 'name', story1);
      storyStore.addStory(kind, 'name', story2);

      expect(storyStore.getStory(kind, 'name')).to.be.equal(story2);
    });
  });

  describe('getStoryKinds', () => {
    it('should return all story kind names with FIFO order', () => {
      const kind1 = UUID.v4();
      const kind2 = UUID.v4();
      const kind3 = UUID.v4();
      function story() {}

      storyStore.addStory(kind1, 'name', story);
      storyStore.addStory(kind2, 'name', story);
      storyStore.addStory(kind3, 'name', story);

      expect(storyStore.getStoryKinds()).to.deep.equal([kind1, kind2, kind3]);
    });
  });

  describe('getStories', () => {
    it('should return an empty array, if there is no kind', () => {
      const kind = UUID.v4();
      expect(storyStore.getStories(kind)).to.deep.equal([]);
    });

    it('should return all story names with FIFO order', () => {
      const kind = UUID.v4();
      function story() {}

      storyStore.addStory(kind, 'name1', story);
      storyStore.addStory(kind, 'name2', story);
      storyStore.addStory(kind, 'name3', story);

      expect(storyStore.getStories(kind)).to.deep.equal(['name1', 'name2', 'name3']);
    });
  });

  describe('getStory', () => {
    it('should return null if there is no kind', () => {
      const kind = UUID.v4();
      expect(storyStore.getStory(kind, 'name')).to.be.equal(null);
    });

    it('should return null if there is no story', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);

      expect(storyStore.getStory(kind, 'other-name')).to.be.equal(null);
    });

    it('shodld return the story if exists', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);

      expect(storyStore.getStory(kind, 'name')).to.be.equal(story);
    });
  });

  describe('removeStoryKind', () => {
    it('should remove the given kind', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);
      expect(storyStore.getStory(kind, 'name')).to.be.equal(story);

      storyStore.removeStoryKind(kind);

      expect(storyStore.getStory(kind, 'name')).to.be.equal(null);
    });
  });

  describe('hasStoryKind', () => {
    it('should return true if there is a kind', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);

      expect(storyStore.hasStoryKind(kind)).to.be.equal(true);
    });

    it('should return false if there is no kind', () => {
      const kind = UUID.v4();
      expect(storyStore.hasStoryKind(kind)).to.be.equal(false);
    });
  });

  describe('hasStory', () => {
    it('should return true if there is a story', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);

      expect(storyStore.hasStory(kind, 'name')).to.be.equal(true);
    });

    it('should return false if there is no kind', () => {
      const kind = UUID.v4();
      expect(storyStore.hasStoryKind(kind, 'name')).to.be.equal(false);
    });

    it('should return false if there is no story', () => {
      const kind = UUID.v4();
      function story() {}
      storyStore.addStory(kind, 'name', story);

      expect(storyStore.hasStory(kind, 'name2')).to.be.equal(false);
    });
  });

  describe('dumpStoryBook', () => {
    it('should dump all story kinds and stories properly', () => {
      const kind1 = UUID.v4();
      const kind2 = UUID.v4();
      function story() {}

      storyStore.addStory(kind1, 'name1', story);
      storyStore.addStory(kind1, 'name2', story);
      storyStore.addStory(kind2, 'name10', story);
      storyStore.addStory(kind2, 'name20', story);

      expect(storyStore.dumpStoryBook()).to.be.deep.equal([
        { kind: kind1, stories: ['name1', 'name2'] },
        { kind: kind2, stories: ['name10', 'name20'] },
      ]);
    });
  });
});
