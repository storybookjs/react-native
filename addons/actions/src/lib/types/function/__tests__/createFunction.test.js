import createFunction from '../createFunction';
import reservedKeywords from '../reservedKeywords';

describe('createFunction', () => {
  it('Can create functions with reserved names', () => {
    reservedKeywords.forEach(reservedKeyword => {
      expect(createFunction(reservedKeyword).name).toBe(`${reservedKeyword}`);
    });
  });
});
