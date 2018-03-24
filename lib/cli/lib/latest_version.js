import { sync as spawnSync } from 'cross-spawn';
import hasYarn from './has_yarn';

const packageManager = hasYarn() ? 'yarn' : 'npm';

export default async function latestVersion(packageName) {
  const result = spawnSync(packageManager, ['info', packageName, '--json'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
    silent: true,
  });

  const info = JSON.parse(result.output[1].toString());
  return info.data.version;
}
