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
  const [storybookVersion, addonActionVersion, addonKnobsVersion] = await getVersions(
    npmOptions,
    '@storybook/marko',
    '@storybook/addon-actions',
    '@storybook/addon-knobs'
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
    `@storybook/marko@${storybookVersion}`,
    `@storybook/addon-actions@${addonActionVersion}`,
    `@storybook/addon-knobs@${addonKnobsVersion}`,
    ...babelDependencies,
  ]);
};
