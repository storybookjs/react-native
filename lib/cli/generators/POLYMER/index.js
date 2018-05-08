import mergeDirs from 'merge-dirs';
import path from 'path';
import { getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async npmOptions => {
  const [
    storybookVersion,
    babelCoreVersion,
    babelRuntimeVersion,
    polymerLoaderVarion,
  ] = await getVersions(
    npmOptions,
    '@storybook/polymer',
    'babel-core',
    'babel-runtime',
    'polymer-webpack-loader'
  );
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson() || {}; // Maybe we are in a bower only project, still we need a package json

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/polymer'] = storybookVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }
  if (!packageJson.dependencies['babel-runtime'] && !packageJson.devDependencies['babel-runtime']) {
    packageJson.devDependencies['babel-runtime'] = babelRuntimeVersion;
  }
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
