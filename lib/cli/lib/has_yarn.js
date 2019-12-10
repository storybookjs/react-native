import { sync as spawnSync } from 'cross-spawn';
import path from 'path';
import findUp from 'find-up';

export default function hasYarn() {
  const yarnAvailable = spawnSync('yarn', ['--version'], { silent: true });
  const npmAvailable = spawnSync('npm', ['--version'], { silent: true });

  const lockFile = findUp.sync(['yarn.lock', 'package-lock.json']);
  const hasYarnLock = lockFile && path.basename(lockFile) === 'yarn.lock';

  if (yarnAvailable.status === 0 && (hasYarnLock || npmAvailable.status !== 0)) {
    return true;
  }
  return false;
}
