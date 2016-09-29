import vm from 'vm';
import fs from 'fs';
import path from 'path';
import moduleSystem from 'module';

function requireModules(keys, root, directory, regExp, recursive) {
  const files = fs.readdirSync(path.join(root, directory));

  files.forEach((filename) => {
    if (regExp.test(filename)) {
      // webpack adds a './' to the begining of the key
      // TODO: Check this in windows
      const entryKey = `./${path.join(directory, filename)}`;
      // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require
      keys[entryKey] = require(path.join(root, directory, filename));
      return;
    }

    if (!recursive) {
      return;
    }

    if (fs.statSync(path.join(root, directory, filename)).isDirectory()) {
      requireModules(keys, root, path.join(directory, filename), regExp, recursive);
    }
  });
}

export default function runWithRequireContext(content, options) {
  const { filename, dirname } = options;

  require.context = (directory, useSubdirectories = false, regExp = /^\.\//) => {
    const fullPath = path.resolve(dirname, directory);
    const keys = {};
    requireModules(keys, fullPath, '.', regExp, useSubdirectories);

    const req = f => (keys[f]);
    req.keys = () => (Object.keys(keys));
    return req;
  };

  const compiledModule = vm.runInThisContext(moduleSystem.wrap(content));
  compiledModule(module.exports, require, module, filename, dirname);
}
