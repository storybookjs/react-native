import path from 'path';
import mergeDirs from 'merge-dirs';
import { getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async () => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
    babelCoreVersion,
  ] = await getVersions(
    '@storybook/mithril',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'babel-core'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;
  packageJson.devDependencies['@storybook/mithril'] = storybookVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
