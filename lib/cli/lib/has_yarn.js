import { sync as spawnSync } from 'cross-spawn';

export default function hasYarn() {
  const result = spawnSync('yarn', ['--version'], { silent: true });
  return result.status === 0;
}
