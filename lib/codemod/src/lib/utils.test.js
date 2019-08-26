import { sanitizeName } from './utils';

it('should sanitize names', () => {
  const testCases = [
    ['basic', 'basic'],
    ['with space', 'withSpace'],
    ['default', 'defaultStory'],
    ['w/punctuation', 'wPunctuation'],
  ];
  testCases.forEach(testCase => {
    const [input, out] = testCase;
    expect(sanitizeName(input)).toBe(out);
  });
});
