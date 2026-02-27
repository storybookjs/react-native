// from estookit/string
const CASE_SPLIT_PATTERN =
  /\p{Lu}?\p{Ll}+|[0-9]+|\p{Lu}+(?!\p{Ll})|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{L}+/gu;
// from estookit/string
function words(str: string) {
  return Array.from(str.match(CASE_SPLIT_PATTERN) ?? []);
}
// from estookit/string
export function startCase(str: string) {
  const words$1 = words(str.trim());
  let result = '';
  for (let i = 0; i < words$1.length; i++) {
    const word = words$1[i];
    if (result) {
      result += ' ';
    }
    result += word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
  return result;
}
