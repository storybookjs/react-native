import { spawn } from 'cross-spawn';
import hasYarn from './has_yarn';

const packageManager = hasYarn() ? 'yarn' : 'npm';

export default function npmInit() {
  const { status, signal, output, pid, stdout, stderr, error, ...rest } = spawn.sync(
    packageManager,
    ['init', '-y'],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8',
      silent: true,
    }
  );
  return rest;
}
