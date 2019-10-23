import fs from 'fs';
import path from 'path';
import readPkgUp from 'read-pkg-up';

const {
  packageJson: { dependencies, devDependencies } = {
    dependencies: undefined,
    devDependencies: undefined,
  },
} = readPkgUp.sync() || {};

export default function hasDependency(name: string): boolean {
  return Boolean(
    (devDependencies && devDependencies[name]) ||
      (dependencies && dependencies[name]) ||
      fs.existsSync(path.join('node_modules', name, 'package.json'))
  );
}
