import { history, document } from 'global';
import {
  pathToId,
  setPath,
  getIdFromLegacyQuery,
  parseQueryParameters,
  initializePath,
} from './url';

jest.mock('global', () => ({
  history: { replaceState: jest.fn() },
  document: {
    location: {
      pathname: 'pathname',
      search: '',
    },
  },
}));

describe('url', () => {
  describe('pathToId', () => {
    it('should parse valid ids', () => {
      expect(pathToId('/story/story--id')).toEqual('story--id');
    });
    it('should error on invalid ids', () => {
      [null, '', '/whatever/story/story--id'].forEach(path => {
        expect(() => pathToId(path)).toThrow(/Invalid/);
      });
    });
  });

  describe('setPath', () => {
    it('should navigate to storyId', () => {
      setPath({ storyId: 'story--id' });
      expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?id=story--id');
    });
    it('should replace legacy parameters but preserve others', () => {
      document.location.search = 'foo=bar&selectedStory=selStory&selectedKind=selKind';
      setPath({ storyId: 'story--id' });
      expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?foo=bar&id=story--id');
    });
  });

  describe('getIdFromLegacyQuery', () => {
    it('should parse story paths', () => {
      expect(getIdFromLegacyQuery({ path: '/story/story--id' })).toBe('story--id');
    });
    it('should parse legacy queries', () => {
      expect(
        getIdFromLegacyQuery({ path: null, selectedKind: 'kind', selectedStory: 'story' })
      ).toBe('kind--story');
    });
    it('should not parse non-queries', () => {
      expect(getIdFromLegacyQuery({})).toBeUndefined();
    });
  });

  describe('parseQueryParameters', () => {
    it('should parse id', () => {
      expect(parseQueryParameters('?foo=bar&id=story--id')).toBe('story--id');
    });
    it('should not parse non-ids', () => {
      expect(parseQueryParameters('')).toBeUndefined();
    });
  });

  describe('initializePath', () => {
    it('should handle id queries', () => {
      document.location.search = '?id=story--id';
      expect(initializePath()).toEqual({ storyId: 'story--id' });
      expect(history.replaceState).not.toHaveBeenCalled();
    });
    it('should redirect legacy queries', () => {
      document.location.search = '?selectedKind=kind&selectedStory=story';
      expect(initializePath()).toEqual({ storyId: 'kind--story' });
      expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?id=kind--story');
    });
  });
});
