const path = require('path');
const fs = require('fs');
const glob = require('glob');
const prettier = require('prettier');

const cwd = process.cwd();

const previewImports = `
  import { decorators, parameters } from './preview';

  if (decorators) {
    decorators.forEach((decorator) => addDecorator(decorator));
  }

  if (parameters) {
    addParameters(parameters);
  }
`;

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function getMainPath({ configPath }) {
  return path.join(cwd, configPath, 'main.js');
}

function getMain({ configPath }) {
  const mainPath = getMainPath({ configPath });
  const main = requireUncached(mainPath);
  return main;
}

function getPreviewPath({ configPath }) {
  return path.join(cwd, configPath, 'preview.js');
}

function getPreviewExists({ configPath }) {
  return fs.existsSync(getPreviewPath({ configPath }));
}

function writeRequires({ configPath }) {
  const storybookRequiresLocation = path.join(cwd, configPath, 'storybook.requires.js');
  const mainPath = getMainPath({ configPath });
  const main = requireUncached(mainPath);
  const storyPaths = main.stories.reduce((acc, storyGlob) => {
    const paths = glob.sync(storyGlob, { cwd: configPath });
    return [...acc, ...paths];
  }, []);

  fs.writeFileSync(storybookRequiresLocation, '');

  const previewExists = getPreviewExists({ configPath });

  let previewJs = previewExists ? previewImports : '';

  const storyRequires = storyPaths.map((storyPath) => `require("${storyPath}")`).join(',');
  const path_array_str = `[${storyRequires}]`;

  const registerAddons = main.addons.map((addon) => `import "${addon}/register";`).join('\n');
  let enhancersImport = '';
  let enhancers = '';

  // TODO: implement presets or something similar
  if (main.addons.includes('@storybook/addon-ondevice-actions')) {
    enhancersImport =
      'import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs"';
    enhancers = 'argsEnhancers.forEach(enhancer => addArgsEnhancer(enhancer))';
  }

  const fileContent = `
      /* do not change this file, it is auto generated by storybook. */

      import { configure, addDecorator, addParameters, addArgsEnhancer } from '@storybook/react-native';

      ${registerAddons}

      ${enhancersImport}

      ${previewJs}

      ${enhancers}

      const getStories=() => {
        return ${path_array_str};
      }

      configure(getStories, module, false)
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
  getMainPath,
  getPreviewExists,
  getPreviewPath,
};
