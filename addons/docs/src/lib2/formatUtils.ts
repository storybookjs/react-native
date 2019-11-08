export function unquote(text: string) {
  return text && text.replace(/^['"]|['"]$/g, '');
}

// TODO: Might not need this.
export function showSpaces(text: string) {
  return text && text.replace(/^\s|\s$/g, '␣');
}
