const { globToRegexp, serverRequire } = require('@storybook/core/common');
const path = require('path');
const fs = require('fs');

const cwd = process.cwd();

const toRequireContext = (specifier) => {
  const { directory, files } = specifier;

  // The importPathMatcher is a `./`-prefixed matcher that includes the directory
  // For `require.context()` we want the same thing, relative to directory
  const match = globToRegexp(`./${files}`);

  return {
    path: directory,
    recursive: files.includes('**') || files.split('/').length > 1,
    match,
  };
};

function requireUncached(module) {
  delete require.cache[require.resolve(module)];

  return serverRequire(module);
}

const supportedExtensions = ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs'];

function getFilePathExtension({ configPath }, fileName) {
  for (const ext of supportedExtensions) {
    const filePath = path.resolve(cwd, configPath, `${fileName}.${ext}`);

    if (fs.existsSync(filePath)) {
      return ext;
    }
  }

  return null;
}

function getMain({ configPath }) {
  const fileExtension = getFilePathExtension({ configPath }, 'main');

  if (fileExtension === null) {
    throw new Error('main config file not found');
  }

  const mainPath = path.resolve(cwd, configPath, `main.${fileExtension}`);

  return requireUncached(mainPath);
}

function ensureRelativePathHasDot(relativePath) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function getPreviewExists({ configPath }) {
  return !!getFilePathExtension({ configPath }, 'preview');
}

function resolveAddonFile(addon, file, extensions = ['js', 'mjs', 'ts']) {
  try {
    const basePath = path.join(addon, file);

    require.resolve(basePath);

    return basePath;
  } catch (error) {}

  for (const ext of extensions) {
    try {
      const filePath = path.join(addon, `${file}.${ext}`);

      require.resolve(filePath);

      return filePath;
    } catch (error) {}
  }

  return null;
}

module.exports = {
  toRequireContext,
  requireUncached,
  getFilePathExtension,
  getMain,
  ensureRelativePathHasDot,
  getPreviewExists,
  resolveAddonFile,
};
