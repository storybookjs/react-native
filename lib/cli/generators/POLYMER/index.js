import mergeDirs from 'merge-dirs';
import path from 'path';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../lib/helpers';

export default async npmOptions => {
  const [storybookVersion, polymerLoaderVarion] = await getVersions(
    npmOptions,
    '@storybook/polymer',
    'polymer-webpack-loader'
  );
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson() || {}; // Maybe we are in a bower only project, still we need a package json

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const devDependencies = [`@storybook/polymer@${storybookVersion}`];
  if (
    !packageJson.dependencies['polymer-webpack-loader'] &&
    !packageJson.devDependencies['polymer-webpack-loader']
  ) {
    devDependencies.push(`polymer-webpack-loader@${polymerLoaderVarion}`);
  }

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [...devDependencies, ...babelDependencies, '-D']);
};
