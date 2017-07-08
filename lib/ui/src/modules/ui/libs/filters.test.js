import { storyFilter } from './filters';

describe('manager.ui.libs.filters', () => {
  describe('storyFilter', () => {
    test('should return null if there are no stories', () => {
      const res = storyFilter();
      expect(res).toBe(null);
    });

    test('should original stories if there is no filter', () => {
      const stories = [{ kind: 'aa', stories: ['bb'] }];
      const res = storyFilter(stories);
      expect(res).toBe(stories);
    });

    test('should always return the selectedKind', () => {
      const stories = [{ kind: 'aa', stories: ['bb'] }, { kind: 'bb', stories: ['bb'] }];
      const selectedKind = 'bb';
      const res = storyFilter(stories, 'no-match', selectedKind);

      expect(res).toEqual([stories[1]]);
    });

    test('should filter kinds correctly', () => {
      const stories = [
        { kind: 'aa', stories: ['bb'] },
        { kind: 'bb', stories: ['bb'] },
        { kind: 'ss', stories: ['bb'] },
      ];
      const selectedKind = 'bb';
      const res = storyFilter(stories, 'aa', selectedKind);

      expect(res).toEqual([stories[0], stories[1]]);
    });

    test('should not sort stories by kind', () => {
      const stories = [
        { kind: 'ss', stories: ['bb'] },
        { kind: 'aa', stories: ['bb'] },
        { kind: 'bb', stories: ['bb'] },
      ];
      const res = storyFilter(stories);

      expect(res).toBe(stories);
    });

    test('should sort stories by kind', () => {
      const stories = [
        { kind: 'ss', stories: ['bb'] },
        { kind: 'aa', stories: ['bb'] },
        { kind: 'bb', stories: ['bb'] },
      ];
      const res = storyFilter(stories, null, null, true);

      expect(res).toEqual([stories[1], stories[2], stories[0]]);
    });

    test('should filter on story level', () => {
      const stories = [
        { kind: 'aa', stories: ['bb'] },
        { kind: 'cc', stories: ['dd'] },
        { kind: 'ee', stories: ['ff'] },
      ];
      const selectedKind = 'aa';
      const res = storyFilter(stories, 'ff', selectedKind);

      expect(res).toEqual([stories[0], stories[2]]);
    });

    test('should filter out unmatched stories at lowest level', () => {
      const stories = [
        { kind: 'aa', stories: ['bb'] },
        { kind: 'cc', stories: ['dd'] },
        { kind: 'ee', stories: ['ff', 'gg'] },
      ];
      const selectedKind = 'aa';
      const res = storyFilter(stories, 'ff', selectedKind);

      expect(res).toEqual([stories[0], { kind: 'ee', stories: ['ff'] }]);
    });
  });
});
