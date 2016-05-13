import { storyFilter } from '../filters';
import { expect } from 'chai';
const { describe, it } = global;

describe('manager.ui.libs.filters', () => {
  describe('storyFilter', () => {
    it('should return null if there are no stories', () => {
      const res = storyFilter();
      expect(res).to.be.equal(null);
    });

    it('should original stories if there is no filter', () => {
      const stories = [{ kind: 'aa', stories: ['bb'] }];
      const res = storyFilter(stories);
      expect(res).to.be.equal(stories);
    });

    it('should always return the selectedKind', () => {
      const stories = [
        { kind: 'aa', stories: ['bb'] },
        { kind: 'bb', stories: ['bb'] },
      ];
      const selectedKind = 'bb';
      const res = storyFilter(stories, 'no-match', selectedKind);

      expect(res).to.deep.equal([stories[1]]);
    });

    it('should filter kinds correctly', () => {
      const stories = [
        { kind: 'aa', stories: ['bb'] },
        { kind: 'bb', stories: ['bb'] },
        { kind: 'ss', stories: ['bb'] },
      ];
      const selectedKind = 'bb';
      const res = storyFilter(stories, 'aa', selectedKind);

      expect(res).to.deep.equal([
        stories[0],
        stories[1],
      ]);
    });
  });
});
