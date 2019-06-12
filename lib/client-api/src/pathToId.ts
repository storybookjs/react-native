export default function pathToId(path: string) {
  const match = (path || '').match(/^\/story\/(.+)/);
  if (!match) {
    throw new Error(`Invalid path '${path}',  must start with '/story/'`);
  }
  return match[1];
}
