import {
  getVersions,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const [storybookVersion, polymerLoaderVarion] = await getVersions(
    npmOptions,
    '@storybook/polymer',
    'polymer-webpack-loader'
  );
  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

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

  installDependencies({ ...npmOptions, packageJson }, [...devDependencies, ...babelDependencies]);
};
