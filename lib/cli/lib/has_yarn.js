import { sync as spawnSync } from 'cross-spawn';
import path from 'path';
import fs from 'fs';
import finder from 'find-package-json';

export default function hasYarn() {
  const yarnAvailable = spawnSync('yarn', ['--version'], { silent: true });
  const npmAvailable = spawnSync('npm', ['--version'], { silent: true });

  if (yarnAvailable.status === 0 && (hasLockFile() || npmAvailable.status !== 0)) {
    return true;
  }
  return false;
}

/**
 * Lookup yarn.lock in the current directory and its ancestor directories,
 * return true if it exists.
 */
function hasLockFile() {
  const f = finder();

  const found = f.next();
  while (!found.done) {
    const dir = path.dirname(found.filename);

    if (fs.existsSync(path.resolve(dir, 'yarn.lock'))) {
      return true;
    }

    // We can assume that current directory isn't inside Yarn workspace
    if (fs.existsSync(path.resolve(dir, 'package-lock.json'))) {
      return false;
    }

    found.next();
  }

  return false;
}
