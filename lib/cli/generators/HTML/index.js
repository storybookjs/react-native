import fse from 'fs-extra';
import path from 'path';
import npmInit from '../../lib/npm_init';
import {
  getVersionedPackages,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const packages = ['@storybook/html'];
  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);
  copyTemplate(__dirname, storyFormat);

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

  installDependencies(npmOptions, [...versionedPackages, ...babelDependencies]);
};
