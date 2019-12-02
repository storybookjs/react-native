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
    latestRaxVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/rax',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'rax'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  const raxVersion = packageJson.dependencies.rax || latestRaxVersion;

  // in case Rax project is not detected, `rax` package is not available either
  packageJson.dependencies.rax = packageJson.dependencies.rax || raxVersion;

  // these packages are required for Welcome story
  packageJson.dependencies['rax-button'] = packageJson.dependencies['rax-button'] || raxVersion;
  packageJson.dependencies['rax-image'] = packageJson.dependencies['rax-image'] || raxVersion;
  packageJson.dependencies['rax-link'] = packageJson.dependencies['rax-link'] || raxVersion;
  packageJson.dependencies['rax-text'] = packageJson.dependencies['rax-text'] || raxVersion;
  packageJson.dependencies['rax-view'] = packageJson.dependencies['rax-view'] || raxVersion;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [
    `@storybook/rax@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
  ]);
};
