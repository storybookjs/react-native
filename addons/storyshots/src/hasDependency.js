import fs from 'fs';
import path from 'path';
import readPkgUp from 'read-pkg-up';

const { pkg } = readPkgUp.sync();

export default function hasDependency(name) {
  return (
    (pkg.devDependencies && pkg.devDependencies[name]) ||
    (pkg.dependencies && pkg.dependencies[name]) ||
    fs.existsSync(path.join('node_modules', name, 'package.json'))
  );
}
