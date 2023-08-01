const path = require('path');
const fs = require('fs');
const glob = require('glob');
const prettier = require('prettier');
const { normalizeStories, toRequireContext } = require('@storybook/core-common');

const cwd = process.cwd();
const supportedExtensions = ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs'];

// we clear decorators as a workaround for global decorators getting infinitely applied on HMR
const previewImports = `
  import { decorators, parameters } from './preview';

  if (decorators) {
    if(__DEV__){
      // stops the warning from showing on every HMR 
      require('react-native').LogBox.ignoreLogs([
        '\`clearDecorators\` is deprecated and will be removed in Storybook 7.0',
      ]);
    }
    // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
    clearDecorators();
    decorators.forEach((decorator) => addDecorator(decorator));
  }

  if (parameters) {
    addParameters(parameters);
  }
`;

function normalizeExcludePaths(paths) {
  // automatically convert a string to an array of a single string
  if (typeof paths === 'string') {
    return [paths];
  }

  // ensure the paths is an array and if any items exists, they are strings
  if (Array.isArray(paths) && paths.every((p) => typeof p === 'string')) {
    return paths;
  }

  // when the paths aren't a string or an (empty) array of strings, return
  return undefined;
}

function requireUncached(module) {
  delete require.cache[require.resolve(module)];

  return require(module);
}

function getMain({ configPath }) {
  const fileExtension = getFilePathExtension({ configPath }, 'main');

  if (fileExtension === null) {
    throw new Error('main config file not found');
  }

  const mainPath = path.resolve(cwd, configPath, `main.${fileExtension}`);

  return requireUncached(mainPath);
}

function getFilePathExtension({ configPath }, fileName) {
  for (const ext of supportedExtensions) {
    const filePath = path.resolve(cwd, configPath, `${fileName}.${ext}`);

    if (fs.existsSync(filePath)) {
      return ext;
    }
  }

  return null;
}

function getPreviewExists({ configPath }) {
  return !!getFilePathExtension({ configPath }, 'preview');
}

function ensureRelativePathHasDot(relativePath) {
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function writeRequires({ configPath, absolute = false, unstable_useRequireContext = false }) {
  const storybookRequiresLocation = path.resolve(cwd, configPath, 'storybook.requires.js');

  const mainImport = getMain({ configPath });

  const main = mainImport.default ?? mainImport;

  const reactNativeOptions = main.reactNativeOptions;

  const excludePaths = reactNativeOptions && reactNativeOptions.excludePaths;

  const normalizedExcludePaths = normalizeExcludePaths(excludePaths);

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  });

  let configure = '';

  if (unstable_useRequireContext) {
    const contexts = storiesSpecifiers.map((specifier) => {
      const { path: p, recursive: r, match: m } = toRequireContext(specifier);
      // TODO remove this dot 👇 and find actual solution
      return `require.context('.${p}', ${r}, ${m})`;
    });

    configure = `
      const stories = [${contexts.join(',')}];
      
      configure(stories, module, false)
    `;
  } else {
    const storyRequires = storiesSpecifiers.reduce((acc, specifier) => {
      const paths = glob
        .sync(specifier.files, {
          cwd: path.resolve(cwd, specifier.directory),
          absolute,
          // default to always ignore (exclude) anything in node_modules
          ignore:
            normalizedExcludePaths !== undefined ? normalizedExcludePaths : ['**/node_modules'],
        })
        .map((storyPath) => {
          const pathWithDirectory = path.join(specifier.directory, storyPath);

          const requirePath = absolute
            ? storyPath
            : ensureRelativePathHasDot(path.relative(configPath, pathWithDirectory));

          const absolutePath = absolute ? requirePath : path.resolve(configPath, requirePath);

          const pathRelativeToCwd = path.relative(cwd, absolutePath);

          const normalizePathForWindows = (str) =>
            path.sep === '\\' ? str.replace(/\\/g, '/') : str;

          return `"./${normalizePathForWindows(
            pathRelativeToCwd
          )}": require("${normalizePathForWindows(requirePath)}")`;
        });
      return [...acc, ...paths];
    }, []);

    const path_obj_str = `{${storyRequires.join(',')}}`;

    configure = `   
      const getStories=() => {
          return ${path_obj_str};
      }

      configure(getStories, module, false)
    `;
  }

  fs.writeFileSync(storybookRequiresLocation, '');

  const previewExists = getPreviewExists({ configPath });

  let previewJs = previewExists ? previewImports : '';

  const registerAddons = main.addons?.map((addon) => `import "${addon}/register";`).join('\n');

  let enhancersImport = '';

  let enhancers = '';

  // TODO: implement presets or something similar
  if (main.addons?.includes('@storybook/addon-ondevice-actions')) {
    enhancersImport =
      'import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs"';

    // try/catch is a temporary fix for https://github.com/storybookjs/react-native/issues/327 until a fix is found
    enhancers = `
      try {
        argsEnhancers.forEach(enhancer => addArgsEnhancer(enhancer));
      } catch{}
    `;
  }

  const normalizedStories = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: specifier.importPathMatcher.source,
  }));

  const globalStories = `global.STORIES = ${JSON.stringify(normalizedStories)}`;

  const fileContent = `
      /* do not change this file, it is auto generated by storybook. */

      import { configure, addDecorator, addParameters, addArgsEnhancer, clearDecorators } from '@storybook/react-native';

      ${globalStories}

      ${registerAddons}

      ${enhancersImport}

      ${previewJs}

      ${enhancers}

      ${configure}
      
  `;

  const formattedFileContent = prettier.format(fileContent, { parser: 'babel' });

  fs.writeFileSync(storybookRequiresLocation, formattedFileContent, {
    encoding: 'utf8',
    flag: 'w',
  });
}

module.exports = {
  writeRequires,
  getMain,
  getPreviewExists,
  getFilePathExtension,
};
