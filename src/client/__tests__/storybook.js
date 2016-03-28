const { describe, it, beforeEach } = global;
import { expect } from 'chai';
import UUID from 'uuid';

import Storybook from '../storybook';
const storybook = new Storybook();

describe('client.storybook', () => {
  beforeEach(() => storybook.clean());

  describe('storybook.addStory', () => {
    it('should add the first story properly', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      expect(storybook.getStory(kind, 'name')).to.be.equal(story);
    });

    it('should add another story of the previous kind', () => {
      const kind = UUID.v4();
      function story1() {}
      function story2() {}
      storybook.addStory(kind, 'name1', story1);
      storybook.addStory(kind, 'name2', story2);

      expect(storybook.getStory(kind, 'name1')).to.be.equal(story1);
      expect(storybook.getStory(kind, 'name2')).to.be.equal(story2);
    });

    it('should replace the same story if came again', () => {
      const kind = UUID.v4();
      function story1() {}
      function story2() {}
      storybook.addStory(kind, 'name', story1);
      storybook.addStory(kind, 'name', story2);

      expect(storybook.getStory(kind, 'name')).to.be.equal(story2);
    });
  });

  describe('storybook.getStoryKinds', () => {
    it('should return all story kind names with FIFO order', () => {
      const kind1 = UUID.v4();
      const kind2 = UUID.v4();
      const kind3 = UUID.v4();
      function story() {}

      storybook.addStory(kind1, 'name', story);
      storybook.addStory(kind2, 'name', story);
      storybook.addStory(kind3, 'name', story);

      expect(storybook.getStoryKinds()).to.deep.equal([kind1, kind2, kind3]);
    });
  });

  describe('storybook.getStories', () => {
    it('should return an empty array, if there is no kind', () => {
      const kind = UUID.v4();
      expect(storybook.getStories(kind)).to.deep.equal([]);
    });

    it('should return all story names with FIFO order', () => {
      const kind = UUID.v4();
      function story() {}

      storybook.addStory(kind, 'name1', story);
      storybook.addStory(kind, 'name2', story);
      storybook.addStory(kind, 'name3', story);

      expect(storybook.getStories(kind)).to.deep.equal(['name1', 'name2', 'name3']);
    });
  });

  describe('storybook.getStory', () => {
    it('should return null if there is no kind', () => {
      const kind = UUID.v4();
      expect(storybook.getStory(kind, 'name')).to.be.equal(null);
    });

    it('should return null if there is no story', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      expect(storybook.getStory(kind, 'other-name')).to.be.equal(null);
    });

    it('shodld return the story if exists', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      expect(storybook.getStory(kind, 'name')).to.be.equal(story);
    });
  });

  describe('storybook.removeStoryKind', () => {
    it('should remove the given kind', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);
      expect(storybook.getStory(kind, 'name')).to.be.equal(story);

      storybook.removeStoryKind(kind);

      expect(storybook.getStory(kind, 'name')).to.be.equal(null);
    });
  });

  describe('storybook.hasStoryKind', () => {
    it('should return true if there is a kind', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      expect(storybook.hasStoryKind(kind)).to.be.equal(true);
    });

    it('should return false if there is no kind', () => {
      const kind = UUID.v4();
      expect(storybook.hasStoryKind(kind)).to.be.equal(false);
    });
  });

  describe('storybook.hasStory', () => {
    it('should return true if there is a story', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      expect(storybook.hasStory(kind, 'name')).to.be.equal(true);
    });

    it('should return false if there is no kind', () => {
      const kind = UUID.v4();
      expect(storybook.hasStoryKind(kind, 'name')).to.be.equal(false);
    });

    it('should return false if there is no story', () => {
      const kind = UUID.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      expect(storybook.hasStory(kind, 'name2')).to.be.equal(false);
    });
  });

  describe('storybook.dumpStoryBook', () => {
    it('should dump all story kinds and stories properly', () => {
      const kind1 = UUID.v4();
      const kind2 = UUID.v4();
      function story() {}

      storybook.addStory(kind1, 'name1', story);
      storybook.addStory(kind1, 'name2', story);
      storybook.addStory(kind2, 'name10', story);
      storybook.addStory(kind2, 'name20', story);

      expect(storybook.dumpStoryBook()).to.be.deep.equal([
        { kind: kind1, stories: ['name1', 'name2'] },
        { kind: kind2, stories: ['name10', 'name20'] },
      ]);
    });
  });
});
