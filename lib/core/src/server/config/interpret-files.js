import fs from 'fs';
import interpret from 'interpret';

// const boost = ['.js', '.jsx', '.ts', '.tsx'];

function getPossibleExtensions() {
  return Object.keys(interpret.extensions).sort((a, b) => {
    if (a === '.js') {
      return -1;
    }

    if (b === '.js') {
      return 1;
    }

    return a.length - b.length;
  });
}

const possibleExtensions = getPossibleExtensions();

export function getInterpretedFile(pathToFile) {
  const candidates = possibleExtensions.map(ext => `${pathToFile}${ext}`);

  return candidates.find(candidate => {
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    return null;
  });
}
