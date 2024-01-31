const {
  toRequireContext,
  ensureRelativePathHasDot,
  getMain,
  getPreviewExists,
} = require('./common');
const { normalizeStories, globToRegexp } = require('@storybook/core-common');
const fs = require('fs');
const prettier = require('prettier');
const path = require('path');

const cwd = process.cwd();

function generate({ configPath, absolute = false, useJs = false }) {
  const storybookRequiresLocation = path.resolve(
    cwd,
    configPath,
    `storybook.requires.${useJs ? 'js' : 'ts'}`
  );

  const mainImport = getMain({ configPath });

  const main = mainImport.default ?? mainImport;

  // const reactNativeOptions = main.reactNativeOptions;

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  });

  // TODO refactor contexts and normalized stories to be one thing
  const normalizedStories = storiesSpecifiers.map((specifier) => {
    // TODO why????
    const reg = globToRegexp(`./${specifier.files}`);

    const { path: p, recursive: r, match: m } = toRequireContext(specifier);

    const pathToStory = ensureRelativePathHasDot(path.posix.relative(configPath, p));
    return `{
      titlePrefix: "${specifier.titlePrefix}",
      directory: "${specifier.directory}",
      files: "${specifier.files}",
      importPathMatcher: /${reg.source}/,
      // @ts-ignore
      req: require.context('${pathToStory}', ${r}, ${m})
    }`;
  });

  const registerAddons = main.addons?.map((addon) => `import "${addon}/register";`).join('\n');

  const doctools = 'require("@storybook/react-native/dist/preview")';

  // TODO: implement presets or something similar
  const enhancer = main.addons?.includes('@storybook/addon-ondevice-actions')
    ? "require('@storybook/addon-actions/preview')"
    : '';

  const previewExists = getPreviewExists({ configPath });

  const annotations = `[${previewExists ? "require('./preview')," : ''}${doctools}, ${enhancer}]`;

  const fileContent = `
  /* do not change this file, it is auto generated by storybook. */

  import { start } from '@storybook/react-native';
  
  ${registerAddons}

  const normalizedStories = [${normalizedStories.join(',')}]

  // @ts-ignore
  global.STORIES = normalizedStories;

  export const view = start({
    annotations: ${annotations},
    storyEntries: normalizedStories
  });
`;

  const formattedFileContent = prettier.format(fileContent, { parser: 'babel' });

  fs.writeFileSync(storybookRequiresLocation, formattedFileContent, {
    encoding: 'utf8',
    flag: 'w',
  });
}

module.exports = {
  generate,
};

// TODO evaluate if this is needed
// if (import.meta.webpackHot) {
//   import.meta.webpackHot.accept('./{{storiesFilename}}', () => {
//     // importFn has changed so we need to patch the new one in
//     preview.onStoriesChanged({ importFn });
//   });

//   import.meta.webpackHot.accept([{{#each previewAnnotations}}'{{this}}',{{/each}}], () => {
//     // getProjectAnnotations has changed so we need to patch the new one in
//     preview.onGetProjectAnnotationsChanged({ getProjectAnnotations });
//   });
// }
