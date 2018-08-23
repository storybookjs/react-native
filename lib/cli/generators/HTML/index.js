import mergeDirs from 'merge-dirs';
import path from 'path';
import npmInit from '../../lib/npm_init';
import { getVersion, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

export default async npmOptions => {
  const storybookVersion = await getVersion(npmOptions, '@storybook/html');
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  let packageJson = getPackageJson();
  if (!packageJson) {
    await npmInit();
    packageJson = getPackageJson();
  }

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/html'] = storybookVersion;

  await installBabel(npmOptions, packageJson);

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
