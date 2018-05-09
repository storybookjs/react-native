import { spawn } from 'cross-spawn';

export default function latestVersion(npmOptions, packageName) {
  const packageManager = npmOptions.useYarn ? 'yarn' : 'npm';
  return new Promise((resolve, reject) => {
    const command = spawn(packageManager, ['info', packageName, 'version', '--json', '--silent'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'pipe',
      encoding: 'utf-8',
      silent: true,
    });

    command.stdout.on('data', data => {
      try {
        const info = JSON.parse(data);
        if (info.error) {
          // npm error
          reject(new Error(info.error.summary));
        } else if (info.type === 'inspect') {
          // yarn success
          resolve(info.data);
        } else {
          // npm success
          resolve(info);
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
