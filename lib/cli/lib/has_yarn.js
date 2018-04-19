import { sync as spawnSync } from 'cross-spawn';
import path from 'path';
import fs from 'fs';

export default function hasYarn() {
  const yarnAvailable = spawnSync('yarn', ['--version'], { silent: true });
  const npmAvailable = spawnSync('npm', ['--version'], { silent: true });
  const yarnLockPath = path.resolve('yarn.lock');
  if ((fs.existsSync(yarnLockPath) || npmAvailable.status !== 0) && yarnAvailable.status === 0) {
    return true;
  }
  return false;
}
