import {
  getVersions,
  retrievePackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
} from '../../lib/helpers';

export default async (npmOptions, { storyFormat = 'csf' }) => {
  const [storybookVersion, linksVersion, actionsVersion, addonsVersion] = await getVersions(
    npmOptions,
    '@storybook/ember',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addons'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = {
    ...packageJson.scripts,
    ...{
      storybook: 'start-storybook -p 6006 -s dist',
      'build-storybook': 'build-storybook -s dist',
    },
  };

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [
    `@storybook/ember@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
  ]);
};
