import mergeDirs from 'merge-dirs';
import path from 'path';
import { getVersions, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

export default async npmOptions => {
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

  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/riot'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;
  if (
    !packageJson.devDependencies['riot-tag-loader'] &&
    !packageJson.dependencies['riot-tag-loader']
  )
    packageJson.devDependencies['riot-tag-loader'] = tagLoaderVersion;

  await installBabel(npmOptions, packageJson);

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
