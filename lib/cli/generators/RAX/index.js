import path from 'path';
import mergeDirs from 'merge-dirs';
import { getVersions, getPackageJson, writePackageJson, installBabel } from '../../lib/helpers';

// prettier-ignore
export default async npmOptions => {
  const [storybookVersion, actionsVersion, linksVersion, addonsVersion, latestRaxVersion] = await getVersions(
    npmOptions,
    '@storybook/rax',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addons',
    'rax'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();
  packageJson.dependencies = packageJson.dependencies || {};

  const raxVersion = packageJson.dependencies.rax || latestRaxVersion;

  // in case Rax project is not detected, `rax` package is not available either
  packageJson.dependencies.rax = packageJson.dependencies.rax || raxVersion;
  // these packages are required for Welcome story
  packageJson.dependencies['rax-button'] = packageJson.dependencies['rax-button'] || raxVersion;
  packageJson.dependencies['rax-image'] = packageJson.dependencies['rax-image'] || raxVersion;
  packageJson.dependencies['rax-link'] = packageJson.dependencies['rax-link'] || raxVersion;
  packageJson.dependencies['rax-text'] = packageJson.dependencies['rax-text'] || raxVersion;
  packageJson.dependencies['rax-view'] = packageJson.dependencies['rax-view'] || raxVersion;

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/addon-actions'] = actionsVersion;
  packageJson.devDependencies['@storybook/addon-links'] = linksVersion;
  packageJson.devDependencies['@storybook/addons'] = addonsVersion;
  packageJson.devDependencies['@storybook/rax'] = storybookVersion;

  await installBabel(npmOptions, packageJson);

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
