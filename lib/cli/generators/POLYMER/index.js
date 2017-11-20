import mergeDirs from 'merge-dirs';
import path from 'path';
import { getVersion, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async () => {
  const version = await getVersion('@storybook/polymer');
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson() || {}; // Maybe we are in a bower only project, still we need a package json

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/polymer'] = version;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
