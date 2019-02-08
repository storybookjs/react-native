import pathToId from './pathToId';

describe('pathToId', () => {
  describe('pathToId', () => {
    it('errors on invalid path', () => {
      expect(() => pathToId('/something/random')).toThrow(/Invalid/);
    });
    it('errors empty path', () => {
      expect(() => pathToId(null)).toThrow(/Invalid/);
    });
    it('succeeds on a valid path', () => {
      expect(pathToId('/story/some--id')).toBe('some--id');
    });
  });
});
