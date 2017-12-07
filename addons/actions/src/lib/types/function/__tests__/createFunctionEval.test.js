import createFunctionEval from '../createFunctionEval';
import reservedKeywords from '../reservedKeywords';

describe('createFunctionEval', () => {
  it('Adds $ suffix for reserved names', () => {
    reservedKeywords.forEach(reservedKeyword => {
      expect(createFunctionEval(reservedKeyword).name).toBe(`${reservedKeyword}$`);
    });
  });
});
