import mergeDirs from 'merge-dirs';
import path from 'path';
import { getVersions, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

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
  packageJson.devDependencies['@storybook/polymer'] = storybookVersion;

  await installBabel(npmOptions, packageJson);

  if (
    !packageJson.dependencies['polymer-webpack-loader'] &&
    !packageJson.devDependencies['polymer-webpack-loader']
  ) {
    packageJson.devDependencies['polymer-webpack-loader'] = polymerLoaderVarion;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
