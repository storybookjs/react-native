const spawnSync = require('cross-spawn').sync;

module.exports = function hasYarn() {
  const result = spawnSync('yarn', ['--version'], { silent: true });
  return result.status === 0;
};
