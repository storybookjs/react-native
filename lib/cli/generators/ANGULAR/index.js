import path from 'path';
import {
  isDefaultProjectSet,
  editStorybookTsConfig,
  getAngularAppTsConfigJson,
  getAngularAppTsConfigPath,
} from './angular-helpers';
import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  writeFileAsJson,
  copyTemplate,
} from '../../lib/helpers';

async function addDependencies(npmOptions, { storyFormat }) {
  const packages = [
    '@storybook/angular',
    '@storybook/addon-notes',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
  ];

  if (storyFormat === 'mdx') {
    packages.push('@storybook/addon-docs');
  }

  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
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
  writeFileAsJson(getAngularAppTsConfigPath(), tsConfigJson);
}

export default async (npmOptions, { storyFormat = 'csf' }) => {
  if (!isDefaultProjectSet()) {
    throw new Error(
      'Could not find a default project in your Angular workspace. Add a project and re-run the installation.'
    );
  }

  copyTemplate(__dirname, storyFormat);

  await addDependencies(npmOptions, { storyFormat });
  editAngularAppTsConfig();
  editStorybookTsConfig(path.resolve('./.storybook/tsconfig.json'));
};
