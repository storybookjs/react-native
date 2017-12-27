import mergeDirs from 'merge-dirs';
import path from 'path';
import { getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async () => {
  const [
    storybookVersion,
    notesVersion,
    actionsVersion,
    linksVersion,
    lodashTypesVersion,
  ] = await getVersions(
    '@storybook/angular',
    '@storybook/addon-notes',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@types/lodash-es'
  );
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/angular'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-notes'] = notesVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@types/lodash-es'] = lodashTypesVersion;

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
