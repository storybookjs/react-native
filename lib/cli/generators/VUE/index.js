import {
  retrievePackageJson,
  getVersion,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  addToDevDependenciesIfNotPresent,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const packages = [
    '@storybook/vue',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'babel-preset-vue',
    '@babel/core',
  ];
  if (storyFormat === 'mdx') {
    packages.push('@storybook/addon-docs');
  }
  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  const packageBabelCoreVersion =
    packageJson.dependencies['babel-core'] || packageJson.devDependencies['babel-core'];

  // This seems to be the version installed by the Vue CLI, and it is not handled by
  // installBabel below. For some reason it leads to the wrong version of @babel/core (a beta)
  // being installed
  if (packageBabelCoreVersion === '7.0.0-bridge.0') {
    addToDevDependenciesIfNotPresent(
      packageJson,
      '@babel/core',
      await getVersion(npmOptions, '@babel/core')
    );
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  // We should probably just not even be using babel-preset-vue directly
  // see: https://github.com/storybookjs/storybook/issues/4475#issuecomment-432141296
  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};
