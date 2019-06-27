import path from 'path';
import fse from 'fs-extra';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../lib/helpers';

export default async npmOptions => {
  const [storybookVersion, linksVersion, actionsVersion, addonsVersion] = await getVersions(
    npmOptions,
    '@storybook/ember',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addons'
  );

  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  const packageJson = getPackageJson();

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

  installDependencies(npmOptions, [
    `@storybook/ember@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
  ]);
};
