import path from 'path';
import mergeDirs from 'merge-dirs';
import { getVersions, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

export default async npmOptions => {
  const [storybookVersion, linksVersion, actionsVersion, addonsVersion] = await getVersions(
    npmOptions,
    '@storybook/ember',
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addons'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/ember'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  await installBabel(npmOptions, packageJson);

  packageJson.scripts = {
    ...packageJson.scripts,
    ...{
      storybook: 'start-storybook -p 6006 -s dist',
      'build-storybook': 'build-storybook -s dist',
    },
  };

  writePackageJson(packageJson);
};
