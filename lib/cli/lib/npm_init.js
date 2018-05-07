import { spawn } from 'cross-spawn';
import hasYarn from './has_yarn';

const packageManager = hasYarn() ? 'yarn' : 'npm';

export default function npmInit() {
  return new Promise((resolve, reject) => {
    const command = spawn(packageManager, ['init', '-y'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8',
      silent: true,
    });

    command.stdout.on('data', resolve);

    command.stderr.on('data', reject);
  });
}
