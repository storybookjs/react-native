import fs from 'fs';
import { extensions } from 'interpret';

const boost = new Set(['.js', '.jsx', '.ts', '.tsx']);

function sortExtensions() {
  return [
    ...Array.from(boost),
    ...Object.keys(extensions)
      .filter(ext => !boost.has(ext))
      .sort((a, b) => a.length - b.length),
  ];
}

const possibleExtensions = sortExtensions();

export function getInterpretedFile(pathToFile) {
  const candidates = possibleExtensions.map(ext => `${pathToFile}${ext}`);

  return candidates.find(candidate => {
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    return null;
  });
}
