import vm from 'vm'
import fs from 'fs'
import path from 'path'
import moduleSystem from 'module'

function requireModules (keys, root, directory, regExp, recursive) {
  const files = fs.readdirSync(path.join(root, directory))

  files.forEach((filename) => {
    // webpack adds a './' to the begining of the key
    // TODO: Check this in windows
    const entryKey = `./${path.join(directory, filename)}`
    if (regExp.test(entryKey)) {
      // eslint-disable-next-line no-param-reassign, global-require, import/no-dynamic-require
      keys[entryKey] = require(path.join(root, directory, filename))
      return
    }

    if (!recursive) {
      return
    }

    if (fs.statSync(path.join(root, directory, filename)).isDirectory()) {
      requireModules(keys, root, path.join(directory, filename), regExp, recursive)
    }
  })
}

function isRelativeRequest (request) {
  if (request.charCodeAt(0) !== 46/* . */) {
    return false
  }

  if (request === '.' || '..') {
    return true
  }

  return request.charCodeAt(1) === 47/* / */ || (
    request.charCodeAt(1) === 46/* . */ && request.charCodeAt(2) === 47/* / */)
}

export default function runWithRequireContext (content, options) {
  const { filename, dirname } = options

  const newRequire = (request) => {
    if (isRelativeRequest(request)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require(path.resolve(dirname, request))
    }

    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(request)
  }

  newRequire.resolve = require.resolve
  newRequire.extensions = require.extensions
  newRequire.main = require.main
  newRequire.cache = require.cache

  newRequire.context = (directory, useSubdirectories = false, regExp = /^\.\//) => {
    const fullPath = path.resolve(dirname, directory)
    const keys = {}
    requireModules(keys, fullPath, '.', regExp, useSubdirectories)

    const req = f => (keys[f])
    req.keys = () => (Object.keys(keys))
    return req
  }

  const compiledModule = vm.runInThisContext(moduleSystem.wrap(content))
  compiledModule(module.exports, newRequire, module, filename, dirname)
}
