import memoize from 'memoizerific';

export const formatter = memoize(2)((code: string) => {
  // code provided to the component is often coming from template literals, which preserve whitespace.
  // sometimes the first line doesn't have padding, but the second does.
  // we split the code-string into lines, then if we find padding on line 0 or 1,
  // we assume that padding is bad, and remove that much padding on all following lines
  return code
    .split(/\n/)
    .reduce(
      (acc, i, index) => {
        const match = i.match(/^((:?\s|\t)+)/);
        const padding = match ? match[1] : '';

        if (acc.firstIndent === '' && padding && index < 3) {
          return { result: `${acc.result}\n${i.replace(padding, '')}`, firstIndent: padding };
        }
        return {
          result: `${acc.result}\n${i.replace(acc.firstIndent, '').replace(/\s*$/, '')}`,
          firstIndent: acc.firstIndent,
        };
      },
      { firstIndent: '', result: '' }
    )
    .result.trim();
});
