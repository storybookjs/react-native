import { spawn } from 'cross-spawn';
import { satisfies } from 'semver';

export default function latestVersion(npmOptions, packageName, constraint) {
  const packageManager = npmOptions.useYarn ? 'yarn' : 'npm';
  return new Promise((resolve, reject) => {
    const command = spawn(
      packageManager,
      ['info', packageName, constraint ? 'versions' : 'version', '--json', '--silent'],
      {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'pipe',
        encoding: 'utf-8',
        silent: true,
      }
    );

    const processResult = result => {
      if (!constraint) return result;

      return result.reverse().find(version => satisfies(version, constraint));
    };

    command.stdout.on('data', data => {
      try {
        const info = JSON.parse(data);
        if (info.error) {
          // npm error
          reject(new Error(info.error.summary));
        } else if (info.type === 'inspect') {
          // yarn success
          resolve(processResult(info.data));
        } else {
          // npm success
          resolve(processResult(info));
        }
      } catch (e) {
        // yarn info output
      }
    });

    command.stderr.on('data', data => {
      try {
        // yarn error
        const info = JSON.parse(data);
        if (info.type === 'error') {
          reject(new Error(info.data));
        }
      } catch (e) {
        // package manager unstructured info/warnings output
      }
    });
  });
}
