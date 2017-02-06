var spawnSync = require('cross-spawn').sync;

module.exports = function hasYarn() {
  var result = spawnSync('yarn', ['--version'], { silent: true });
  return result.status === 0;
}
