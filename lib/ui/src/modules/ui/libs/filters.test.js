import { storyFilter } from './filters';

describe('manager.ui.libs.filters', () => {
  describe('storyFilter', () => {
    test('should return null if there are no stories', () => {
      const res = storyFilter();
      expect(res).toBe(null);
    });

    test('should original stories if there is no filter', () => {
      const stories = [{ kind: ['aa'], namespaces: ['aa'], stories: ['bb'], rootName: '' }];
      const res = storyFilter(stories);
      expect(res).toBe(stories);
    });

    test('should always return the selectedKind', () => {
      const stories = [
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'bb', namespaces: ['bb'], stories: ['bb'], rootName: '' },
      ];

      const selectedKind = 'bb';
      const selectedStory = 'bb';
      const res = storyFilter(stories, 'no-match', selectedKind, selectedStory);

      expect(res).toMatchObject([stories[1]]);
    });

    test('should always return the selectedKind with the single selectedStory', () => {
      const stories = [
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'bb', namespaces: ['bb'], stories: ['bb', 'cc', 'dd'], rootName: '' },
      ];

      const selectedKind = 'bb';
      const selectedStory = 'cc';
      const res = storyFilter(stories, 'no-match', selectedKind, selectedStory);

      expect(res[0].stories).toEqual(['cc']);
    });

    test('should filter kinds correctly', () => {
      const stories = [
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'bb', namespaces: ['bb'], stories: ['bb'], rootName: '' },
        { kind: 'ss', namespaces: ['ss'], stories: ['bb'], rootName: '' },
      ];
      const selectedKind = 'bb';
      const selectedStory = 'bb';
      const res = storyFilter(stories, 'aa', selectedKind, selectedStory);

      expect(res).toMatchObject([stories[0], stories[1]]);
    });

    test('should not sort stories by kind', () => {
      const stories = [
        { kind: 'ss', namespaces: ['ss'], stories: ['bb'], rootName: '' },
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'bb', namespaces: ['bb'], stories: ['bb'], rootName: '' },
      ];
      const res = storyFilter(stories);

      expect(res).toBe(stories);
    });

    test('should sort stories by kind', () => {
      const stories = [
        { kind: 'ss', namespaces: ['ss'], stories: ['bb'], rootName: '' },
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'bb', namespaces: ['bb'], stories: ['bb'], rootName: '' },
      ];
      const res = storyFilter(stories, null, null, null, true);

      expect(res).toEqual([stories[1], stories[2], stories[0]]);
    });

    test('should filter on story level', () => {
      const stories = [
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'cc', namespaces: ['cc'], stories: ['dd'], rootName: '' },
        { kind: 'ee', namespaces: ['ee'], stories: ['ff'], rootName: '' },
      ];
      const selectedKind = 'aa';
      const selectedStory = 'bb';
      const res = storyFilter(stories, 'ff', selectedKind, selectedStory);

      expect(res).toMatchObject([stories[0], stories[2]]);
    });

    test('should filter out unmatched stories at lowest level', () => {
      const stories = [
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'cc', namespaces: ['cc'], stories: ['dd'], rootName: '' },
        { kind: 'ee', namespaces: ['ee'], stories: ['ff', 'gg'], rootName: '' },
      ];
      const selectedKind = 'aa';
      const selectedStory = 'bb';
      const res = storyFilter(stories, 'ff', selectedKind, selectedStory);

      expect(res).toMatchObject([stories[0], { kind: 'ee', stories: ['ff'], rootName: '' }]);
    });

    test('should be case insensitive at tree level', () => {
      const stories = [
        { kind: 'Aa', namespaces: ['aA'], stories: ['bb'], rootName: '' },
        { kind: 'cc', namespaces: ['cc'], stories: ['dd'], rootName: '' },
      ];
      const selectedKind = 'aA';
      const res = storyFilter(stories, 'aa', selectedKind);

      expect(res).toMatchObject([stories[0]]);
    });

    test('should be case insensitive at story level', () => {
      const stories = [
        { kind: 'aa', namespaces: ['aa'], stories: ['bb'], rootName: '' },
        { kind: 'cc', namespaces: ['cc'], stories: ['dd', 'eE'], rootName: '' },
      ];
      const selectedKind = 'aa';
      const selectedStory = 'bb';
      const res = storyFilter(stories, 'ee', selectedKind, selectedStory);

      expect(res).toMatchObject([stories[0], { kind: 'cc', stories: ['eE'], rootName: '' }]);
    });
  });
});
