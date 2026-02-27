const { globToRegexp } = require('storybook/internal/common');
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

function getFilePathWithExtension({ configPath }, fileName) {
  for (const ext of supportedExtensions) {
    const filePath = path.resolve(cwd, configPath, `${fileName}.${ext}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function ensureRelativePathHasDot(relativePath) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function getPreviewExists({ configPath }) {
  return !!getFilePathExtension({ configPath }, 'preview');
}

function resolveAddonFile(addon, file, extensions = ['js', 'mjs', 'ts'], configPath) {
  if (!addon || typeof addon !== 'string') return null;

  const resolvePaths = { paths: [cwd] };

  try {
    const basePath = `${addon}/${file}`;

    require.resolve(basePath, resolvePaths);

    return basePath;
  } catch (_error) {}

  for (const ext of extensions) {
    try {
      const filePath = `${addon}/${file}.${ext}`;

      require.resolve(filePath, resolvePaths);

      return filePath;
    } catch (_error) {}
  }

  // attempt to resolve as a relative path for local addons
  if (addon.startsWith('./') || addon.startsWith('../')) {
    try {
      const extension = getFilePathExtension({ configPath }, `${addon}/${file}`);

      if (extension) {
        return `${addon}/${file}`;
      }
    } catch (_error) {}
  }

  return null;
}

function getAddonName(addon) {
  if (typeof addon === 'string') return addon;

  if (typeof addon === 'object' && addon.name && typeof addon.name === 'string') return addon.name;

  console.error('Invalid addon configuration', addon);

  return null;
}

module.exports = {
  toRequireContext,
  getFilePathExtension,
  ensureRelativePathHasDot,
  getPreviewExists,
  resolveAddonFile,
  getAddonName,
  getFilePathWithExtension,
};
