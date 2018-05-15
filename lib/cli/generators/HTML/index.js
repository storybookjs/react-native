import mergeDirs from 'merge-dirs';
import path from 'path';
import npmInit from '../../lib/npm_init';
import { getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async npmOptions => {
  const [storybookVersion, babelCoreVersion, babelRuntimeVersion] = await getVersions(
    npmOptions,
    '@storybook/html',
    'babel-core',
    'babel-runtime'
  );
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  let packageJson = getPackageJson();
  if (!packageJson) {
    await npmInit();
    packageJson = getPackageJson();
  }

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/html'] = storybookVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }
  if (!packageJson.dependencies['babel-runtime'] && !packageJson.devDependencies['babel-runtime']) {
    packageJson.devDependencies['babel-runtime'] = babelRuntimeVersion;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
