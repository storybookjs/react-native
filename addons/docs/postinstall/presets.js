const fs = require('fs');
const { addPreset, getFrameworks } = require('@storybook/addons');
// eslint-disable-next-line import/no-extraneous-dependencies
const { logger } = require('@storybook/node-logger');

const SUPPORTED_FRAMEWORKS = ['angular', 'html', 'react', 'vue', 'web-components'];

export default function transformer(file, api) {
  const packageJson = JSON.parse(fs.readFileSync('./package.json'));
  const frameworks = getFrameworks(packageJson);

  let err = null;
  let framework = null;
  let presetOptions = null;
  if (frameworks.length !== 1) {
    err = `${frameworks.length === 0 ? 'No' : 'Multiple'} frameworks found: ${frameworks}`;
  } else {
    // eslint-disable-next-line prefer-destructuring
    framework = frameworks[0];
    if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
      err = `Unsupported framework: '${framework}'`;
    }
  }

  if (err) {
    logger.error(`${err}, please configure '@storybook/addon-docs' manually.`);
    return file.source;
  }

  const { dependencies, devDependencies } = packageJson;
  if (
    framework === 'react' &&
    ((dependencies && dependencies['react-scripts']) ||
      (devDependencies && devDependencies['react-scripts']))
  ) {
    presetOptions = {
      configureJSX: true,
    };
  }

  const j = api.jscodeshift;
  const root = j(file.source);

  addPreset(`@storybook/addon-docs/${framework}/preset`, presetOptions, { root, api });

  return root.toSource();
}
