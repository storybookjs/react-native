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
  return possibleExtensions
    .map(ext => `${pathToFile}${ext}`)
    .find(candidate => fs.existsSync(candidate));
}

export function getInterpretedFileWithExt(pathToFile) {
  return possibleExtensions
    .map(ext => ({
      path: `${pathToFile}${ext}`,
      ext,
    }))
    .find(candidate => fs.existsSync(candidate.path));
}
