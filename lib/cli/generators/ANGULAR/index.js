import mergeDirs from 'merge-dirs';
import path from 'path';
import {
  getVersions,
  getPackageJson,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  getAngularAppTsConfigJson,
  writeAngularAppTsConfig,
} from '../../lib/helpers';

async function addDependencies(npmOptions) {
  const [
    storybookVersion,
    notesVersion,
    actionsVersion,
    linksVersion,
    addonsVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/angular',
    '@storybook/addon-notes',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons'
  );

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies(npmOptions, [
    `@storybook/angular@${storybookVersion}`,
    `@storybook/addon-notes@${notesVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
    '-D',
  ]);
}

function editAngularAppTsConfig() {
  const tsConfigJson = getAngularAppTsConfigJson();
  const glob = '**/*.stories.ts';
  if (!tsConfigJson) {
    return;
  }

  const { exclude = [] } = tsConfigJson;
  if (exclude.includes(glob)) {
    return;
  }

  tsConfigJson.exclude = [...exclude, glob];
  writeAngularAppTsConfig(tsConfigJson);
}

export default async npmOptions => {
  mergeDirs(path.resolve(__dirname, 'template'), '.', 'overwrite');

  await addDependencies(npmOptions);
  editAngularAppTsConfig();
};
