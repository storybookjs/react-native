const spawnSync = require('cross-spawn').sync;

export default function hasYarn() {
  const result = spawnSync('yarn', ['--version'], { silent: true });
  return result.status === 0;
}
