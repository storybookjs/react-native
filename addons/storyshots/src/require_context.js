import { process } from 'global';
import vm from 'vm';
import fs from 'fs';
import path from 'path';
import moduleSystem from 'module';

function requireModules(keys, root, directory, regExp, recursive) {
  const files = fs.readdirSync(path.join(root, directory));

  files.forEach(filename => {
    // webpack adds a './' to the begining of the key
    // TODO: Check this in windows
    const entryKey = `./${path.join(directory, filename)}`;
    if (regExp.test(entryKey)) {
      keys[entryKey] = require(path.join(root, directory, filename)); // eslint-disable-line
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

function isRelativeRequest(request) {
  if (request.charCodeAt(0) !== 46) {
    /* . */ return false;
  }

  if (request === '.' || '..') {
    return true;
  }

  return (
    request.charCodeAt(1) === 47 /* / */ ||
    (request.charCodeAt(1) === 46 /* . */ && request.charCodeAt(2) === 47) /* / */
  );
}

function getFullPath(dirname, request) {
  if (isRelativeRequest(request) || !process.env.NODE_PATH) {
    return path.resolve(dirname, request);
  }

  return path.resolve(process.env.NODE_PATH, request);
}

export default function runWithRequireContext(content, options) {
  const { filename, dirname } = options;

  const newRequire = request => {
    if (isRelativeRequest(request)) {
      return require(path.resolve(dirname, request)); // eslint-disable-line
    }

    return require(request); // eslint-disable-line
  };

  newRequire.resolve = require.resolve;
  newRequire.extensions = require.extensions;
  newRequire.main = require.main;
  newRequire.cache = require.cache;

  newRequire.context = (directory, useSubdirectories = false, regExp = /^\.\//) => {
    const fullPath = getFullPath(dirname, directory);

    const keys = {};
    requireModules(keys, fullPath, '.', regExp, useSubdirectories);

    const req = f => keys[f];
    req.keys = () => Object.keys(keys);
    return req;
  };

  const compiledModule = vm.runInThisContext(moduleSystem.wrap(content));
  compiledModule(module.exports, newRequire, module, filename, dirname);
}
