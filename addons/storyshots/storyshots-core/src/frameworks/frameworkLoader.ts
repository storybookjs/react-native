/* eslint-disable global-require,import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import { Loader } from './Loader';
import { StoryshotsOptions } from '../api/StoryshotsOptions';

const loaderScriptName = 'loader';

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();

function getLoaders(): Loader[] {
  return fs
    .readdirSync(__dirname)
    .map(name => path.join(__dirname, name))
    .filter(isDirectory)
    .reduce(
      (acc, framework) => {
        const filename = path.join(framework, loaderScriptName);
        const jsFile = `${filename}.js`;
        const tsFile = `${filename}.ts`;

        return acc.concat([jsFile, tsFile]);
      },
      [] as string[]
    )
    .filter(fs.existsSync)
    .map(loader => require(loader).default);
}

function loadFramework(options: StoryshotsOptions) {
  const loaders = getLoaders();

  const loader = loaders.find(frameworkLoader => frameworkLoader.test(options));

  if (!loader) {
    throw new Error(
      "Couldn't find an appropriate framework loader -- do you need to set the `framework` option?"
    );
  }

  return loader.load(options);
}

export default loadFramework;
