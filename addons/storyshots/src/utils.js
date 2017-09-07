import path from 'path';

export function getStoryshotFile(fileName) {
  const { dir, name } = path.parse(fileName);
  return path.format({ dir: path.join(dir, '__snapshots__'), name, ext: '.storyshot' });
}

export function getPossibleStoriesFiles(storyshotFile) {
  const { dir, name } = path.parse(storyshotFile);

  return [
    path.format({ dir: path.dirname(dir), name, ext: '.js' }),
    path.format({ dir: path.dirname(dir), name, ext: '.jsx' }),
  ];
}
