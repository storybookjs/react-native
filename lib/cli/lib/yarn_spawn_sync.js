import { spawn as spawnSync } from 'cross-spawn';
import hasYarn from './has_yarn';

export default function yarnSpawnSync(options, args) {
  const pkgmgr = Boolean(options.useNpm !== true) && hasYarn() ? 'yarn' : 'npm';
  spawnSync(pkgmgr, args, { stdio: 'inherit' });
}
