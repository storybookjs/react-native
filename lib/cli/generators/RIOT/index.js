import {
  getVersions,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    tagLoaderVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/riot',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'riot-tag-loader'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  const dependencies = [
    `@storybook/riot@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
  ];
  if (
    !packageJson.devDependencies['riot-tag-loader'] &&
    !packageJson.dependencies['riot-tag-loader']
  )
    dependencies.push(`riot-tag-loader@${tagLoaderVersion}`);

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...dependencies, ...babelDependencies]);
};
