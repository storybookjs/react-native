import path from 'path';
import mergeDirs from 'merge-dirs';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
} from '../../lib/helpers';

export default async npmOptions => {
  const [storybookVersion, actionsVersion, linksVersion, addonsVersion] = await getVersions(
    npmOptions,
    '@storybook/preact',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [
    `@storybook/preact@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
    '-D',
  ]);
};
