import fs from 'fs';
import path from 'path';
import readPkgUp from 'read-pkg-up';

const { package: { dependencies, devDependencies } = {} } = readPkgUp.sync() || {};

export default function hasDependency(name) {
  return (
    (devDependencies && devDependencies[name]) ||
    (dependencies && dependencies[name]) ||
    fs.existsSync(path.join('node_modules', name, 'package.json'))
  );
}
