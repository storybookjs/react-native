import mergeDirs from 'merge-dirs';
import path from 'path';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  addToDevDependenciesIfNotPresent,
} from '../../lib/helpers';

export default async npmOptions => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    babelPresetVersion,
    babelCoreVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/vue',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'babel-preset-vue',
    '@babel/core'
  );

  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  const packageBabelCoreVersion =
    packageJson.dependencies['babel-core'] || packageJson.devDependencies['babel-core'];

  // This seems to be the version installed by the Vue CLI, and it is not handled by
  // installBabel below. For some reason it leads to the wrong version of @babel/core (a beta)
  // being installed
  if (packageBabelCoreVersion === '7.0.0-bridge.0') {
    addToDevDependenciesIfNotPresent(packageJson, '@babel/core', babelCoreVersion);
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  // We should probably just not even be using babel-preset-vue directly
  // see: https://github.com/storybooks/storybook/issues/4475#issuecomment-432141296
  installDependencies(npmOptions, [
    `@storybook/vue@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    `babel-preset-vue@${babelPresetVersion}`,
    ...babelDependencies,
  ]);
};
