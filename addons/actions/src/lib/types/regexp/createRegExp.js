export default function createRegExp(regExp) {
  const parts = regExp.split('/');

  return new RegExp(parts[1], parts[2]);
}
