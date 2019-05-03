import mergeDirs from 'merge-dirs';
import path from 'path';
import npmInit from '../../lib/npm_init';
import {
  getVersion,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../lib/helpers';

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

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [`@storybook/html@${storybookVersion}`, ...babelDependencies]);
};
