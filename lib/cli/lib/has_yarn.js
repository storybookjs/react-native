import path from 'path';
import fs from 'fs';

export default function hasYarn() {
  const yarnLockPath = path.resolve('yarn.lock');
  if (!fs.existsSync(yarnLockPath)) {
    return false;
  }
  return true;
}
