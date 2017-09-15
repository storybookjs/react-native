import mergeDirs from 'merge-dirs';
import path from 'path';
import { getVersion, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async () => {
  const version = await getVersion('@storybook/angular');
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/angular'] = version;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
