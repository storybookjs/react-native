import path from 'path';
import fs from 'fs';
import semver from 'semver';
import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const packages = [
    '@storybook/react',
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];

  if (storyFormat === 'mdx') {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 9009';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  if (fs.existsSync(path.resolve('./public'))) {
    // has a public folder and add support to it.
    packageJson.scripts.storybook += ' -s public';
    packageJson.scripts['build-storybook'] += ' -s public';
  }

  writePackageJson(packageJson);

  // When working with `create-react-app@>=2.0.0`, we know `babel-loader` is installed.
  let babelDependencies = [];
  const reactScriptsDep =
    packageJson.dependencies['react-scripts'] || packageJson.devDependencies['react-scripts'];

  if (reactScriptsDep && semver.gtr('2.0.0', reactScriptsDep)) {
    babelDependencies = await getBabelDependencies(npmOptions, packageJson);
  }

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};
