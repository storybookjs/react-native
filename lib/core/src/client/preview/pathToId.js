export default function pathToId(path) {
  const match = (path || '').match(/^\/components\/(.+)/);
  if (!match) {
    throw new Error(`Invalid path '${path}',  must start with '/components/'`);
  }
  return match[1];
}
