import mergeDirs from 'merge-dirs';
import path from 'path';
import fs from 'fs';
import { getVersions, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

export default async npmOptions => {
  const [storybookVersion, actionsVersion, linksVersion, addonsVersion] = await getVersions(
    npmOptions,
    '@storybook/react',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.devDependencies['@storybook/react'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;

  await installBabel(npmOptions, packageJson);

  packageJson.scripts.storybook = 'start-storybook -p 9009';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  if (fs.existsSync(path.resolve('./public'))) {
    // has a public folder and add support to it.
    packageJson.scripts.storybook += ' -s public';
    packageJson.scripts['build-storybook'] += ' -s public';
  }

  writePackageJson(packageJson);
};
