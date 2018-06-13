/* eslint-disable global-require,import/no-dynamic-require */
import fs from 'fs';
import path from 'path';

const loaderScriptName = 'loader.js';

const isDirectory = source => fs.lstatSync(source).isDirectory();

function getLoaders() {
  return fs
    .readdirSync(__dirname)
    .map(name => path.join(__dirname, name))
    .filter(isDirectory)
    .map(framework => path.join(framework, loaderScriptName))
    .filter(fs.existsSync)
    .map(loader => require(loader).default);
}

function loadFramework(options) {
  const loaders = getLoaders();

  const loader = loaders.find(frameworkLoader => frameworkLoader.test(options));

  if (!loader) {
    throw new Error('storyshots is intended only to be used with storybook');
  }

  return loader.load(options);
}

export default loadFramework;
